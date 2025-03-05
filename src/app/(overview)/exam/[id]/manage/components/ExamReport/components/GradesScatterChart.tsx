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
	const questionsData = requiredQuestions.map(question => {
		const { correctAnswers, totalAnswers } = questionCorrectPercentage[question.id] || {}

		return {
			number: question.number,
			correctAnswers: correctAnswers ?? 0,
			incorrectAnswers: totalAnswers ?? 0 - correctAnswers ?? 0
		}
	})

	const questionsSize = max(requiredQuestions.map(question => question.number))!
	const maxYValue = max(questionsData.map(question => max([question.correctAnswers, question.incorrectAnswers])!))!

	return (
		<ScatterChart
			h={300}
			data={[
				{
					color: "blue.6",
					name: "Acertos",
					data: questionsData.map(({ number, correctAnswers }) => ({
						number,
						answers: correctAnswers
					}))
				},
				{
					color: "red.6",
					name: "Erros",
					data: questionsData.map(({ number, incorrectAnswers }) => ({
						number,
						answers: incorrectAnswers
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
			yAxisProps={{
				domain: [0, maxYValue],
				tickCount: maxYValue < 5 ? maxYValue + 1 : 6
			}}
			valueFormatter={{
				x: (value) => `Questão ${value}`
			}}
			withTooltip
			withLegend
		/>
	)
}
