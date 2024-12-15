import { HydratedDocument, Types } from "mongoose"
import type { IStartedExam } from "@models/typings/StartedExam"
import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { IAnswer } from "@models/typings/Answer"
import type { ISubmit } from "@models/typings/Submit"
import type { IUser } from "@models/typings/User"
import { Exam, StartedExam } from "@models"
import { Divider, Title } from "@mantine/core"
import { notFound } from "next/navigation"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import CandidatesTable from "./components/CandidatesTable"
import AddCandidate from "./components/CandidatesTable/components/AddCandidate"
import routes from "@app/routes"

const title = routes.exam.children.template.children.manage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function ManageExamPage({ params }: PageProps){
	await connectDatabase()

	const { id } = await params

	const [exam] = await Promise.all([
		Exam
			.findById(id, {
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

	const startedExams = await StartedExam.aggregate<HydratedDocument<IStartedExam> & {
		submit: (HydratedDocument<ISubmit> & {
			answers: HydratedDocument<IAnswer>[]
		}) | null
	}>([
		{
			$match: {
				exam,
				user: { $in: exam.candidates }
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

	const candidatesStartedExams = new Map<string, typeof startedExams[number]>

	for(const startedExam of startedExams){
		candidatesStartedExams.set((startedExam.user as Types.ObjectId).toString(), startedExam)
	}

	return (
		<div className="flex flex-col gap-3xl">
			<header>
				<Title order={1} fz="4xl">
					{exam.title || "Teste sem nome"}
				</Title>
			</header>

			<Divider />

			<div className="flex flex-col gap-lg">
				<CandidatesTable
					examId={id}
					data={exam.candidates.map(({ _id, name, email, username }) => {
						const id = _id.toString()
						const startedExam = candidatesStartedExams.get(id)
						const hasAnswer = !!startedExam?.submit
						const pendingCorrection = hasAnswer && startedExam.submit!.answers.some(answer => {
							return !("isCorrect" in answer) || answer.isCorrect === undefined
						})

						return {
							id,
							name,
							email,
							username,
							startedAt: startedExam?.startedAt.toLocaleDateString("pt-BR"),
							hasAnswer,
							isExpired: hasAnswer ? Date.now() > startedExam.submit!.createdAt.getTime() : false,
							pendingCorrection
						}
					})}
					key={`${exam.__v}.${exam.candidates.length}`}
				/>

				<AddCandidate examId={id} />
			</div>
		</div>
	)
}
