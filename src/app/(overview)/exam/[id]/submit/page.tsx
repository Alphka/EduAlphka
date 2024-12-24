import type { ExamMultipleChoiceQuestion, ExamQuestion, IExam } from "@models/typings/Exam"
import type { IStartedExam } from "@models/typings/StartedExam"
import type { PageProps } from "@typings/index"
import type { ISubmit } from "@models/typings/Submit"
import type { IAnswer } from "@models/typings/Answer"
import type { IUser } from "@models/typings/User"
import { Divider, Grid, GridCol, Paper } from "@mantine/core"
import { Types, type HydratedDocument } from "mongoose"
import { Exam, StartedExam } from "@models"
import { notFound } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import SubmitExamForm from "./components/SubmitExamForm"
import StartExamModal from "./components/StartExamModal"

export default async function SubmitExamPage({ params }: PageProps){
	await connectDatabase()

	const { id } = await params

	const [exam, user] = await Promise.all([
		Exam.findById(id, {
			title: 1,
			owner: 1,
			subject: 1,
			duration: 1,
			description: 1,
			questions: 1,
			expiresAt: 1,
			createdAt: 1
		})
			.populate<{ owner: HydratedDocument<Pick<IUser, "name">> }>("owner", "-_id name"),
		verifyAuthorization({ accountType: "candidate" })
	])

	if(!exam) notFound()

	const startedExam = await StartedExam.aggregate<(HydratedDocument<IStartedExam> & {
		submit: (HydratedDocument<ISubmit> & {
			answers: HydratedDocument<IAnswer>[]
		}) | null
	}) | null>([
		{
			$match: {
				exam: exam._id,
				user: new Types.ObjectId(user.id)
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
		},
		{
			$limit: 1
		}
	]).then(result => result[0] || null)

	const examClient = pick(exam.toJSON({
		flattenObjectIds: true
	}), [
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

	if(!startedExam){
		return (
			<StartExamModal
				exam={examClient}
			/>
		)
	}

	const pendingCorrection = !!startedExam.submit && startedExam.submit.answers.some(answer => !("isCorrect" in answer) || answer.isCorrect === undefined)

	const incorrectAnswers: string[] = []
	const correctAnswers: string[] = []
	const pendingAnswers: string[] = []

	if(startedExam.submit){
		const questionsMap = new Map(exam.questions.map(question => [question.id, question]))

		for(const answer of startedExam.submit.answers){
			const questionId = answer.question.toString()
			const question = questionsMap.get(questionId)

			if(!question){
				console.error("Answer's question was not found in exam. Answer ID: %s, Question ID: %s", answer.id, questionId)
				continue
			}

			if(answer.isCorrect) correctAnswers.push(questionId)
			else if(answer.isCorrect === false) incorrectAnswers.push(questionId)
			else if(question.isRequired) pendingAnswers.push(questionId)
		}
	}

	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length
	const grade = correctAnswers.length

	return (
		<div className="flex flex-col gap-3xl">
			<header className="flex items-center justify-end flex-wrap gap-md">
				<h1 className="flex-grow text-h3 font-bold">
					{exam.title}
				</h1>

				{!!startedExam.submit && (
					<Paper
						className={twJoin(
							"leading-none px-sm py-xs shadow-xs",
							pendingCorrection ? "bg-yellow-light text-yellow-light-color border-yellow-light-hover" : "bg-green-light text-green-light-color border-green-light-hover"
						)}
						title={pendingCorrection ? "Nota final pendente de correção" : undefined}
						aria-label={`${grade} ${grade === 1 ? "acerto" : "acertos"} de ${maxGrade} ${maxGrade === 1 ? "questão" : "questões"}${pendingCorrection ? " (Nota final pendente de correção)" : ""}`}
						withBorder
					>
						Nota: {grade}
					</Paper>
				)}
			</header>

			<Divider />

			<Paper
				className="flex flex-col p-xl gap-md shadow-xs"
				withBorder
			>
				<Grid
					gutter="sm"
					grow
				>
					<GridCol className="flex items-baseline gap-1">
						<p className="text-5xl font-semibold">Professor:</p>
						<span className="text-gray-500">{exam.owner.name}</span>
					</GridCol>

					{exam.subject && (
						<GridCol className="flex items-baseline gap-1">
							<p className="text-5xl font-semibold">Disciplina:</p>
							<span className="text-gray-500">{exam.subject}</span>
						</GridCol>
					)}

					<GridCol className="flex items-baseline gap-1">
						<p className="text-5xl font-semibold">Pontuação máxima:</p>
						<span className="text-gray-500">{maxGrade}</span>
					</GridCol>

					{exam.expiresAt && (
						<GridCol className="flex items-baseline gap-1">
							<p className="text-5xl font-semibold">Data final para a entrega do teste:</p>
							<span className="text-gray-500">{exam.expiresAt.toLocaleString("pt-BR")}</span>
						</GridCol>
					)}

					<GridCol className="flex items-baseline gap-1">
						<p className="text-5xl font-semibold">Descrição:</p>
						<p className="text-gray-500 whitespace-pre-wrap">{exam.description}</p>
					</GridCol>
				</Grid>
			</Paper>

			<SubmitExamForm
				exam={pick(examClient, ["_id", "questions"] as const)}
				submit={startedExam.submit ? {
					incorrectAnswers,
					correctAnswers,
					pendingAnswers
				} : undefined}
				defaultValues={startedExam.submit ? {
					question: startedExam.submit.answers.map(({ option, content }) => ({
						option: option?.toString(),
						content
					}))
				} : undefined}
			/>
		</div>
	)
}
