import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { PageProps } from "@typings"
import type { IUser } from "@models/typings/User"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Types, type HydratedDocument } from "mongoose"
import { Divider, Paper, Tooltip } from "@mantine/core"
import { twJoin } from "tailwind-merge"
import { Exam, StartedExam } from "@models"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import SubmitExamForm from "./components/SubmitExamForm"
import StartExamModal from "./components/StartExamModal"
import RemainingTime from "./components/RemainingTime"
import routes from "@app/routes"
import { omit } from "lodash"

export default async function SubmitExamPage({ params }: PageProps){
	const [{ id }] = await Promise.all([
		params,
		connectDatabase()
	])

	const user = await verifyAuthorization({ accountType: "candidate" })

	if(!Types.ObjectId.isValid(id)) notFound()

	const exam = await Exam
		.findById(id, {
			title: 1,
			owner: 1,
			subject: 1,
			duration: 1,
			questions: 1,
			candidates: 1,
			description: 1,
			createdAt: 1,
			expiresAt: 1
		})
		.populate<{
			owner: HydratedDocument<Pick<IUser, "name">>
		}>("owner", {
			_id: 0,
			name: 1
		})
		.orFail(notFound)

	if(!exam.candidates.includes(new Types.ObjectId(user.id))){
		redirect(routes.accessDenied.pathname, RedirectType.replace)
	}

	const submitData = await exam.getSubmitData(user.id)

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

	if(!submitData){
		return (
			<StartExamModal exam={examClient} />
		)
	}

	if(!submitData.submit && await StartedExam.hydrate(submitData).isExpired({ exam })){
		redirect(routes.accessDenied.pathname, RedirectType.replace)
	}

	const pendingCorrection = submitData.pendingCorrection

	const answers = submitData.submit?.answers.map(({ _id, type, question, feedback, option, content, isCorrect }) => ({
		_id: _id.toString(),
		option: option?.toString(),
		question: question.toString(),
		content,
		feedback,
		isCorrect: pendingCorrection && type === "dissertative" ? undefined : isCorrect
	}))

	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex items-center justify-end flex-wrap gap-md">
				<h1 className="flex-grow text-h4 xs:text-h3">
					{exam.title}
				</h1>

				{!!submitData && !!submitData.submit ? (
					<Tooltip
						py="sm"
						px="md"
						fz="xs"
						label="Nota final pendente de correção"
						opened={pendingCorrection ? undefined : false}
						events={{ hover: true, focus: false, touch: true }}
						position="right"
						withArrow
					>
						<Paper
							className={twJoin(
								"leading-none px-sm py-xs shadow-xs",
								pendingCorrection ? "bg-yellow-light text-yellow-light-color border-yellow-light-hover" : "bg-green-light text-green-light-color border-green-light-hover"
							)}
							aria-label={`${submitData.grade} ${submitData.grade === 1 ? "acerto" : "acertos"} de ${maxGrade} ${maxGrade === 1 ? "questão" : "questões"}${pendingCorrection ? " (Nota final pendente de correção)" : ""}`}
							withBorder
						>
							Nota: {submitData.grade} de {maxGrade}
						</Paper>
					</Tooltip>
				) : (
					<RemainingTime
						examId={exam.id}
						createdAt={submitData.createdAt}
						examDuration={exam.duration}
					/>
				)}
			</header>

			<Divider />

			<Paper
				className="flex flex-col p-xl gap-xs shadow-xs"
				component="ul"
				withBorder
			>
				<li>
					<span className="font-semibold">Aplicador do teste: </span>
					{exam.owner.name}
				</li>

				{exam.subject && (
					<li>
						<span className="font-semibold">Disciplina: </span>
						{exam.subject}
					</li>
				)}

				<li>
					<span className="font-semibold">Nota máxima: </span>
					{maxGrade}
				</li>

				{exam.expiresAt && (
					<li>
						<span className="font-semibold">Data final para entrega: </span>
						{exam.expiresAt.toLocaleString("pt-BR")}
					</li>
				)}

				<li>
					<span className="font-semibold">Descrição: </span>
					<span className="whitespace-pre-wrap">{exam.description}</span>
				</li>
			</Paper>

			<SubmitExamForm
				exam={pick(examClient, ["_id", "questions"] as const)}
				answers={answers && pendingCorrection ? answers.map(answer => omit(answer, "feedback")) : answers}
				defaultValues={submitData.submit ? {
					question: submitData.submit.answers.map(({ option, content }) => ({
						option: option?.toString(),
						content
					}))
				} : undefined}
			/>
		</div>
	)
}
