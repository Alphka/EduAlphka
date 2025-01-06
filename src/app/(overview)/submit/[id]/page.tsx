import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam, IExamMethods } from "@models/typings/Exam"
import type { ISubmit, ISubmitMethods } from "@models/typings/Submit"
import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Types, type HydratedDocument } from "mongoose"
import { Divider, Paper } from "@mantine/core"
import { Exam, Submit } from "@models"
import { useId } from "react"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import getExamSubmitData from "@app/(overview)/exam/helpers/getSubmitData"
import connectDatabase from "@lib/connectDatabase"
import CorrectExamForm from "../components/CorrectExamForm"
import routes from "@app/routes"

const title = routes.submit.children.template.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function SubmitFeedbackPage({ params }: PageProps){
	const titleId = useId()

	const [{ id }] = await Promise.all([
		params,
		connectDatabase()
	])

	if(!Types.ObjectId.isValid(id)) notFound()

	const submit = await Submit
		.findById<HydratedDocument<Pick<ISubmit, "_id"> & {
			exam: Types.ObjectId
			user: Types.ObjectId
		}> & ISubmitMethods>(id, {
			exam: 1,
			user: 1
		})
		.populate<{
			user: HydratedDocument<Pick<IUser, "_id" | "name">>
		}>("user", {
			name: 1
		})
		.orFail(notFound)

	const [exam, user] = await Promise.all([
		Exam
			.findById<HydratedDocument<Pick<IExam,
				| "_id"
				| "owner"
				| "title"
				| "subject"
				| "duration"
				| "questions"
				| "candidates"
				| "description"
				| "expiresAt"
			>> & IExamMethods>(submit.exam, {
				owner: 1,
				title: 1,
				subject: 1,
				duration: 1,
				questions: 1,
				candidates: 1,
				description: 1,
				expiresAt: 1
			})
			.orFail(() => {
				console.error("Submit exam not found")
				notFound()
			}),
		verifyAuthorization({ accountType: "professor" })
	])

	if(!exam.owner._id.equals(user.id)) redirect(routes.accessDenied.pathname, RedirectType.replace)

	const startedExam = await getExamSubmitData(exam._id, submit.user._id)

	if(!startedExam?.submit){
		console.error("Started exam for submit not found")
		notFound()
	}

	const examClient = pick(exam.toJSON({ flattenObjectIds: true }), [
		"_id",
		"title",
		"owner",
		"subject",
		"duration",
		"description",
		"expiresAt",
		"createdAt",
		"questions"
	] as const) as unknown as Pick<IExam,
		| "title"
		| "subject"
		| "duration"
		| "description"
		| "expiresAt"
		| "createdAt"
	> & {
		_id: string
		owner: Pick<IUser, "name">
		questions: (Pick<ExamQuestion, "type" | "text" | "isRequired"> & {
			_id: string
			options: (Pick<ExamMultipleChoiceQuestion["options"][number], "text"> & {
				_id: string
			})[]
		})[]
	}

	examClient.questions = examClient.questions.map(({ options, ...question }) => ({
		...pick(question, [
			"_id",
			"type",
			"text",
			"isRequired"
		] as const),
		options: options.map(option => pick(option, ["_id", "text"] as const))
	}))

	const pendingCorrection = !!startedExam.submit && startedExam.submit.answers.some(answer => !("isCorrect" in answer) || answer.isCorrect === undefined)

	let grade = 0
	let pendingAnswers = 0

	const answers = startedExam.submit.answers.map(({ _id, question, feedback, option, content, isCorrect }) => {
		if(isCorrect === undefined) pendingAnswers++
		else if(isCorrect) grade++

		return {
			_id: _id.toString(),
			option: option?.toString(),
			question: question.toString(),
			content,
			feedback,
			isCorrect
		}
	})

	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex items-center justify-end flex-wrap gap-md">
				<h1 className="flex-grow text-h4 xs:text-h3">
					{title}
				</h1>
			</header>

			<Divider />

			<section className="flex flex-col gap-lg">
				<h2 id={titleId} className="text-h3">
					Informações do teste
				</h2>

				<Paper
					className="flex flex-col p-xl gap-xs shadow-xs"
					component="ul"
					aria-labelledby={titleId}
					withBorder
				>
					<li>
						<span className="font-semibold">Título: </span>
						{exam.title}
					</li>

					<li>
						<span className="font-semibold">Aluno: </span>
						{submit.user.name}
					</li>

					{exam.subject && (
						<li>
							<span className="font-semibold">Disciplina: </span>
							{exam.subject}
						</li>
					)}

					<li>
						<span className="font-semibold">Nota {pendingCorrection && "parcial"} do aluno: </span>
						{grade} de {maxGrade} {!!pendingAnswers && <>({pendingAnswers} respostas pendentes)</>}
					</li>

					{exam.expiresAt && (
						<li>
							<span className="font-semibold">Data final para entrega: </span>
							{exam.expiresAt.toLocaleString("pt-BR")}
						</li>
					)}

					<li>
						<span className="font-semibold">Descrição: </span>
						{exam.description}
					</li>
				</Paper>
			</section>

			<CorrectExamForm
				submitId={submit.id}
				exam={pick(examClient, ["_id", "questions"] as const)}
				answers={answers}
			/>
		</div>
	)
}
