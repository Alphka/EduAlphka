import type { HydratedDocument, Types } from "mongoose"
import type { PageProps } from "@typings"
import type { Metadata } from "next"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Exam, ExamInvite, StartedExam } from "@models"
import { Divider, Paper } from "@mantine/core"
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
		connectDatabase()
	])

	const [exam, user] = await Promise.all([
		Exam
			.findById(id, {
				owner: 1,
				title: 1,
				duration: 1,
				expiresAt: 1,
				candidates: 1,
				disallowedCandidates: 1,
				__v: 1
			})
			.populate<{
				candidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">>>
			}>("candidates", {
				name: 1,
				username: 1
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

	if(!exam.owner._id.equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const [examInvite, submitData] = await Promise.all([
		ExamInvite.findOne({ exam }),
		exam.getSubmitData(exam.candidates.map(({ _id }) => _id))
	])

	const candidatesStartedExams = new Map<string, typeof submitData[number]>

	for(const startedExam of submitData){
		candidatesStartedExams.set(startedExam.user.toString(), startedExam)
	}

	const [averageGrade] = await Promise.all([exam.getAverageGrade()])

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
				data={await Promise.all(exam.candidates.map(async ({ _id, name, username }) => {
					const id = _id.toString()
					const startedExam = candidatesStartedExams.get(id)
					const submitId = startedExam?.submit?._id.toString() as string | undefined
					const pendingCorrection = !!startedExam?.pendingCorrection

					return {
						id,
						name,
						submitId,
						username,
						createdAt: startedExam?.createdAt.toLocaleDateString("pt-BR"),
						isExpired: startedExam ? await StartedExam.hydrate(startedExam).isExpired({ exam }) : false,
						pendingCorrection
					}
				}))}
				disallowedCandidates={exam.disallowedCandidates.map(({ _id, name, username }) => ({
					id: _id.toString(),
					name,
					username
				}))}
				key={`${exam.__v}.${exam.candidates.length}`}
			/>

			<Paper
				className="flex flex-col p-xl gap-lg"
				withBorder
			>
				<section className="flex flex-col gap-md">
					<header>
						<h2 className="text-h5">
							Relatório das respostas do teste
						</h2>
					</header>

					<Paper
						className="bg-dark-800 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 p-xs sm:p-md shadow-none"
						component="ul"
						withBorder
					>
						{Object.entries({
							"Nota média": averageGrade
						}).map(([key, value]) => (
							<Paper
								className="flex flex-col p-md shadow-xs"
								component="ul"
								withBorder
								key={key}
							>
								<h3 className="font-medium">{key}</h3>
								<p>{value}</p>
							</Paper>
						))}
					</Paper>
				</section>
			</Paper>
		</div>
	)
}
