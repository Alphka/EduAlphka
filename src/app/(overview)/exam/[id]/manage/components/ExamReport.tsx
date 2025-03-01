import type { HydratedDocument, Types } from "mongoose"
import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { BarChart } from "@mantine/charts"
import { Submit } from "@models"
import { Paper } from "@mantine/core"

const QUESTION_TEXT_LIMIT = 20

const truncate = (input: string) => input.length > QUESTION_TEXT_LIMIT ? `${input.substring(0, QUESTION_TEXT_LIMIT)}…` : input

interface ExamReportProps{
	exam: HydratedDocument<Pick<IExam, "_id" | "title" | "duration" | "questions" | "expiresAt"> & {
		owner: Types.ObjectId
		candidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">> | Types.ObjectId>
		disallowedCandidates: Types.Array<HydratedDocument<Pick<IUser, "_id" | "name" | "username">>>
	}> & IExamMethods
}

export default async function ExamReport({ exam }: ExamReportProps){
	const hasSubmit = await Submit.exists({ exam }).then(Boolean)

	if(!hasSubmit){
		return null
	}

	const [averageGrade, questionCorrectPercentage] = await Promise.all([
		exam.getAverageGrade(),
		exam.getQuestionCorrectPercentage()
	])

	const requiredQuestions = exam.questions
		.map((question, index) => {
			// @ts-expect-error
			question.number = index + 1
			return question
		})
		.filter(question => question.isRequired)

	return (
		<Paper
			className="flex flex-col p-xl gap-lg"
			withBorder
		>
			<section className="flex flex-col gap-md">
				<header>
					<h1 className="text-h5">
						Relatório das respostas do teste
					</h1>
				</header>

				<div className="flex flex-col gap-xl">
					<ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 shadow-none">
						<Paper
							className="flex flex-col p-md shadow-xs"
							component="ul"
							withBorder
						>
							<h2 className="font-bold">Nota média</h2>
							<p>{Math.round(Number(averageGrade.toPrecision(6)) * 100) / 100} de {requiredQuestions.length}</p>
						</Paper>
					</ul>

					<article className="flex flex-col gap-sm">
						<h2 className="text-h5">Acertos por questão</h2>

						<BarChart
							h={200}
							data={requiredQuestions.map(question => ({
								// @ts-expect-error
								text: `Questão ${question.number}: ${truncate(question.text)}`,
								"Porcentagem de acertos": questionCorrectPercentage[question.id]
							}))}
							maxBarWidth={100}
							dataKey="text"
							orientation="vertical"
							yAxisProps={{ width: 150 }}
							barProps={{ radius: 10 }}
							series={[{ name: "Porcentagem de acertos", color: "blue.6" }]}
						/>
					</article>
				</div>
			</section>
		</Paper>
	)
}
