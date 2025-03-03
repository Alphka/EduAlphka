import type { HydratedDocument, Types } from "mongoose"
import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { ComponentProps } from "react"
import type { IUser } from "@models/typings/User"
import { Submit } from "@models"
import { Paper } from "@mantine/core"
import { pick } from "lodash"
import GradesScatterChart from "./components/GradesScatterChart"
import GradesPieChart from "./components/GradesPieChart"

interface ExamReportProps {
	exam: HydratedDocument<Pick<IExam, "_id" | "title" | "duration" | "questions" | "expiresAt"> & {
		owner: Types.ObjectId
		candidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">> | Types.ObjectId>
		disallowedCandidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">>>
	}> & IExamMethods
}

export default async function ExamReport({ exam }: ExamReportProps){
	const submit = await Submit.exists({ exam })

	if(!submit){
		return null
	}

	const requiredQuestions = exam.questions
		.map((question, index) => {
			// @ts-expect-error
			question.number = index + 1
			return question
		})
		.filter(question => question.isRequired)

	const [
		averageGrade,
		questionCorrectPercentage
	] = await Promise.all([
		exam.getAverageGrade(),
		exam.getQuestionCorrectPercentage()
	])

	let totalCorrectAnswers = 0
	let totalIncorrectAnswers = 0

	for(const question of requiredQuestions){
		const correctPercentage = questionCorrectPercentage[question.id]

		if(!correctPercentage) continue

		const { correctAnswers, totalAnswers } = correctPercentage

		totalCorrectAnswers += correctAnswers
		totalIncorrectAnswers += totalAnswers - correctAnswers
	}

	return (
		<Paper
			className="flex flex-col p-xl gap-lg"
			withBorder
		>
			<section className="flex flex-col gap-xl">
				<header>
					<h1 className="text-h5">
						Relatório das respostas do teste
					</h1>
				</header>

				<ul className="flex flex-col gap-sm">
					<li className="flex flex-col gap-xs">
						<h2 className="font-bold">Nota média do teste</h2>
						<p>{Math.round(Number(averageGrade.toPrecision(6)) * 100) / 100} de {requiredQuestions.length}</p>
					</li>
				</ul>

				<div className="flex flex-col gap-xl">
					<ul className="grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-md shadow-none">
						<Paper
							className="flex flex-col p-md gap-lg shadow-xs"
							component="li"
							withBorder
						>
							<h2 className="font-bold">Quantidade de acertos e erros</h2>

							<GradesPieChart
								{...{
									totalCorrectAnswers,
									totalIncorrectAnswers
								}}
							/>
						</Paper>

						<Paper
							className="flex flex-col p-md gap-lg shadow-xs"
							component="li"
							withBorder
						>
							<h2 className="font-bold">Quantidade de acertos e erros por questão</h2>

							<GradesScatterChart
								{...{
									requiredQuestions: requiredQuestions.map(question => pick(question, ["id", "text", "number"] as const)) as ComponentProps<typeof GradesScatterChart>["requiredQuestions"],
									questionCorrectPercentage
								}}
							/>
						</Paper>
					</ul>
				</div>
			</section>
		</Paper>
	)
}
