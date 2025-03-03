"use client"

import type { IExamMethods } from "@models/typings/Exam"
import { ScatterChart } from "@mantine/charts"
import { max } from "lodash"

interface GradesScatterChartProps {
	requiredQuestions: {
		id: string
		text: string
		number: number
	}[]
	questionCorrectPercentage: Awaited<ReturnType<IExamMethods["getQuestionCorrectPercentage"]>>
}

export default function GradesScatterChart({ requiredQuestions, questionCorrectPercentage }: GradesScatterChartProps){
	const questionsSize = max(requiredQuestions.map(question => question.number)) as number

	return (
		<ScatterChart
			h={300}
			data={[
				{
					color: "blue.6",
					name: "Acertos",
					data: requiredQuestions.map(question => ({
						number: question.number,
						answers: questionCorrectPercentage[question.id]?.correctAnswers ?? 0
					}))
				},
				{
					color: "red.6",
					name: "Erros",
					data: requiredQuestions.map(question => ({
						number: question.number,
						answers: (questionCorrectPercentage[question.id]?.totalAnswers ?? 0) - (questionCorrectPercentage[question.id]?.correctAnswers ?? 0)
					}))
				}
			]}
			dataKey={{ x: "number", y: "answers" }}
			labels={{ x: "Questão", y: "Respostas" }}
			yAxisLabel="Nota"
			xAxisProps={{
				domain: [1, questionsSize],
				tickCount: questionsSize
			}}
			valueFormatter={{
				x: (value) => `Questão ${value}`
			}}
			withTooltip
		/>
	)
}
