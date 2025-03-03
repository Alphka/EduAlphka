import type { ComponentProps } from "react"
import type { IExamInvite } from "@models/typings/ExamInvite"
import type { PageProps } from "@typings"
import type { Metadata } from "next"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Exam, ExamInvite, StartedExam } from "@models"
import { Types, type HydratedDocument } from "mongoose"
import { Button, Divider } from "@mantine/core"
import { MdChevronLeft } from "react-icons/md"
import verifyAuthorization from "@helpers/verifyAuthorization"
import RemoveExamButton from "./components/RemoveExamButton"
import connectDatabase from "@lib/connectDatabase"
import CandidatesTable from "./components/CandidatesTable"
import ExamInvitation from "./components/ExamInvitation"
import ExamReport from "./components/ExamReport"
import routes from "@app/routes"
import Link from "next/link"

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
		connectDatabase()
	])

	const [exam, user] = await Promise.all([
		Exam
			.findById<HydratedDocument<Pick<IExam, "_id" | "title" | "duration" | "questions" | "expiresAt"> & {
				owner: Types.ObjectId
			}>>(id, {
				owner: 1,
				title: 1,
				duration: 1,
				questions: 1,
				candidates: 1,
				disallowedCandidates: 1,
				expiresAt: 1,
				__v: 1
			})
			.populate<{
				candidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">> | Types.ObjectId>
			}>({
				path: "candidates",
				select: {
					name: 1,
					username: 1
				},
				transform: (document, id) => document === null ? id : document
			})
			.populate<{
				disallowedCandidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">>>
			}>("disallowedCandidates", {
				name: 1,
				username: 1
			})
			.orFail(notFound),
		verifyAuthorization({ accountType: "professor" })
	])

	if(!exam.owner._id.equals(user.id)){
		redirect(routes.accessDenied.pathname, RedirectType.replace)
	}

	const [examInvite, submitData] = await Promise.all([
		ExamInvite.findOne<HydratedDocument<Pick<IExamInvite, "_id" | "token">>>({ exam }, {
			token: 1,
			__v: 1
		}),
		exam.getSubmitData(exam.candidates.map(({ _id }) => _id))
	])

	const candidatesStartedExams = new Map<string, typeof submitData[number]>

	for(const startedExam of submitData){
		candidatesStartedExams.set(startedExam.user.toString(), startedExam)
	}

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex flex-col gap-y-xl">
				<div className="flex items-center justify-between *:flex-shrink-0 gap-md">
					<Button
						className="max-xs:ps-2 max-xs:pe-2"
						href={routes.exam.children.template.pathname.replace("[id]", id)}
						size="sm"
						radius="xl"
						color="gray"
						variant="light"
						component={Link}
						aria-label="Voltar para a página do teste"
						prefetch
					>
						<div className="flex items-center gap-sm">
							<MdChevronLeft className="text-lg" />
							<span className="max-xs:hidden">Voltar</span>
						</div>
					</Button>

					<RemoveExamButton
						examId={id}
						examName={exam.title}
					/>
				</div>

				<h1 className="flex-grow text-h4 xs:text-h3 break-words">
					{exam.title}
				</h1>
			</header>

			<Divider />

			<ExamInvitation
				examId={id}
				isExpired={exam.isExpired()}
				inviteToken={examInvite?.token || undefined}
				key={`invite:${examInvite?.__v}`}
			/>

			<CandidatesTable
				examId={id}
				data={(await Promise.all(exam.candidates.map(async candidate => {
					const isDeleted = candidate instanceof Types.ObjectId
					const id = isDeleted ? candidate.toString() : candidate._id.toString()

					const startedExam = candidatesStartedExams.get(id)
					const submitId = startedExam?.submit?._id.toString() as string | undefined
					const pendingCorrection = !!startedExam?.pendingCorrection

					return {
						id,
						name: isDeleted ? "Conta apagada" : candidate.name,
						submitId,
						username: isDeleted ? "" : candidate.username,
						startedAt: startedExam?.createdAt,
						isExpired: startedExam ? await StartedExam.hydrate(startedExam).isExpired({ exam }) : false,
						pendingCorrection,
						isDeleted
					}
				})))
					.sort((a, b) => {
						if(!a.startedAt && !b.startedAt) return 0

						if(!a.startedAt) return -1
						if(!b.startedAt) return 1

						const dateA = new Date(a.startedAt)
						const dateB = new Date(b.startedAt)

						return dateB.getTime() - dateA.getTime()
					})
					.map(data => ({
						...data,
						startedAt: data.startedAt?.toLocaleDateString("pt-BR")
					}))
				}
				disallowedCandidates={exam.disallowedCandidates.map(({ _id, name, username }) => ({
					id: _id.toString(),
					name,
					username
				}))}
				key={`candidates:${exam.__v}.${exam.candidates.length}`}
			/>

			<ExamReport
				exam={exam as ComponentProps<typeof ExamReport>["exam"]}
				key={`report:${exam.__v}.${exam.candidates.length}`}
			/>
		</div>
	)
}
