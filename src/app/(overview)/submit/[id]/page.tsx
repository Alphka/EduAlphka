import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { PageProps } from "@typings"
import type { Metadata } from "next"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Types, type HydratedDocument } from "mongoose"
import { Button, Divider, Paper } from "@mantine/core"
import { MdChevronLeft } from "react-icons/md"
import { Exam, Submit } from "@models"
import { useId } from "react"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import CorrectExamForm from "../components/CorrectExamForm"
import routes from "@app/routes"
import Link from "next/link"

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

	if(!Types.ObjectId.isValid(id)){
		notFound()
	}

	const [user, submit] = await Promise.all([
		verifyAuthorization({ accountType: "professor" }),
		Submit
			.findById(id, {
				exam: 1,
				user: 1,
				publishedAt: 1
			})
			.populate<{
				user: HydratedDocument<Pick<IUser, "_id" | "name">>
			}>("user", {
				name: 1
			})
			.orFail(notFound)
	])

	const exam = await Exam
		.findById(submit.exam, {
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
		})

	if(!exam.owner._id.equals(user.id)){
		redirect(routes.accessDenied.pathname, RedirectType.replace)
	}

	const submitData = await exam.getSubmitData(submit.user._id)

	if(!submitData?.submit){
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

	const answers = submitData.submit.answers.map(({ _id, question, feedback, option, content, isCorrect }) => ({
		_id: _id.toString(),
		option: option?.toString(),
		question: question.toString(),
		content,
		feedback,
		isCorrect
	}))

	const requiredQuestions = new Set(exam.questions.filter(({ isRequired }) => isRequired).map(question => question.id))
	const pendingAnswers = answers.filter(({ isCorrect }) => isCorrect === undefined).length
	const maxGrade = requiredQuestions.size
	const grade = answers.filter(({ isCorrect }) => isCorrect).length

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex flex-col gap-y-xl">
				<div className="flex items-center justify-between *:flex-shrink-0 gap-md">
					<Button
						href={routes.exam.children.template.pathname.replace("[id]", exam.id)}
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
				</div>

				<h1 className="flex-grow text-h4 xs:text-h3 break-words">
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
						<span className="font-semibold">Candidato: </span>
						{submit.user.name}
					</li>

					{exam.subject && (
						<li>
							<span className="font-semibold">Disciplina: </span>
							{exam.subject}
						</li>
					)}

					<li>
						<span className="font-semibold" aria-live="polite">Nota {pendingAnswers > 0 && "parcial"} do candidato: </span>
						{grade} de {maxGrade} {!!pendingAnswers && `(${pendingAnswers} ${pendingAnswers === 1 ? "resposta pendente" : "respostas pendentes"})`}
					</li>

					{exam.expiresAt && (
						<li>
							<span className="font-semibold">Data final para entrega: </span>
							{exam.expiresAt.toLocaleString("pt-BR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							})}
						</li>
					)}

					<li>
						<span className="font-semibold">Descrição do teste: </span>
						{exam.description}
					</li>
				</Paper>
			</section>

			<CorrectExamForm
				submitId={submit.id}
				exam={pick(examClient, ["_id", "questions"] as const)}
				answers={answers}
				canEdit={submitData.pendingCorrection}
			/>
		</div>
	)
}
