import type { IStartedExam } from "@models/typings/StartedExam"
import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { IAnswer } from "@models/typings/Answer"
import type { ISubmit } from "@models/typings/Submit"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Exam, ExamInvite, StartedExam } from "@models"
import { Types, type HydratedDocument } from "mongoose"
import { Divider } from "@mantine/core"
import verifyAuthorization from "@helpers/verifyAuthorization"
import RemoveExamButton from "./components/RemoveExamButton"
import connectDatabase from "@lib/connectDatabase"
import CandidatesTable from "./components/CandidatesTable"
import ExamInvitation from "./components/ExamInvitation"
import routes from "@app/routes"

const title = routes.exam.children.template.children.manage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function ManageExamPage({ params }: PageProps){
	const [{ id }] = await Promise.all([
		params,
		await connectDatabase()
	])

	const [exam, user] = await Promise.all([
		Exam
			.findById(id, {
				owner: 1,
				title: 1,
				candidates: 1,
				__v: 1
			})
			.populate<{
				candidates: Types.DocumentArray<Pick<IUser, "_id" | "name" | "email" | "username">>
			}>("candidates", {
				name: 1,
				email: 1,
				username: 1
			})
			.lean(),
		verifyAuthorization({ accountType: "professor" })
	])

	if(!exam) notFound()
	if(!(exam.owner as Types.ObjectId).equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const [examInvite, startedExams] = await Promise.all([
		ExamInvite.findOne({ exam }),
		StartedExam.aggregate<HydratedDocument<IStartedExam> & {
			submit?: (HydratedDocument<ISubmit> & {
				answers: HydratedDocument<IAnswer>[]
			})
		}>([
			{
				$match: {
					exam: exam._id,
					user: {
						$in: exam.candidates.map(candidate => candidate._id)
					}
				}
			},
			{
				$lookup: {
					as: "submit",
					from: "submits",
					let: {
						userId: "$user",
						examId: "$exam"
					},
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$user", "$$userId"] },
										{ $eq: ["$exam", "$$examId"] }
									]
								}
							}
						},
						{
							$lookup: {
								as: "answers",
								from: "answers",
								localField: "_id",
								foreignField: "submit"
							}
						},
						{
							$limit: 1
						}
					]
				}
			},
			{
				$set: {
					submit: { $arrayElemAt: ["$submit", 0] }
				}
			}
		])
	])

	const candidatesStartedExams = new Map<string, typeof startedExams[number]>

	for(const startedExam of startedExams){
		candidatesStartedExams.set((startedExam.user as Types.ObjectId).toString(), startedExam)
	}

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex justify-end flex-wrap gap-md">
				<h1 className="flex-grow text-h4 xs:text-h3">
					{exam.title}
				</h1>

				<RemoveExamButton
					examId={id}
					examName={exam.title}
				/>
			</header>

			<Divider />

			<ExamInvitation
				examId={id}
				inviteToken={examInvite?.token || undefined}
				key={examInvite?.__v}
			/>

			<CandidatesTable
				examId={id}
				data={exam.candidates.map(({ _id, name, email, username }) => {
					const id = _id.toString()
					const startedExam = candidatesStartedExams.get(id)
					const hasSubmit = !!startedExam?.submit
					const pendingCorrection = hasSubmit && startedExam.submit!.answers.some(answer => !("isCorrect" in answer) || answer.isCorrect === undefined)

					return {
						id,
						name,
						email,
						username,
						startedAt: startedExam?.startedAt.toLocaleDateString("pt-BR"),
						hasSubmit,
						isExpired: hasSubmit ? Date.now() > startedExam.submit!.createdAt.getTime() : false,
						pendingCorrection
					}
				})}
				key={`${exam.__v}.${exam.candidates.length}`}
			/>
		</div>
	)
}
