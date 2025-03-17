"use client"

import type { IExamMethods } from "@models/typings/Exam"
import { useMediaQuery } from "@mantine/hooks"
import { ScatterChart } from "@mantine/charts"
import { max } from "lodash"
import tailwindConfig from "@root/tailwind.config"

interface GradesScatterChartProps {
	requiredQuestions: {
		id: string
		text: string
		number: number
	}[]
	questionCorrectPercentage: Awaited<ReturnType<IExamMethods["getQuestionCorrectPercentage"]>>
}

export default function GradesScatterChart({ requiredQuestions, questionCorrectPercentage }: GradesScatterChartProps){
	const isMobile = useMediaQuery(`not all and (min-width: ${tailwindConfig.theme.screens.xs})`)

	const questionsData = requiredQuestions.map(question => {
		const { correctAnswers, incorrectAnswers } = questionCorrectPercentage[question.id] || {}

		return {
			number: question.number,
			correctAnswers: correctAnswers || undefined,
			incorrectAnswers: incorrectAnswers || undefined
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
						answers: correctAnswers as unknown as number
					}))
				},
				{
					color: "red.6",
					name: "Erros",
					data: questionsData.map(({ number, incorrectAnswers }) => ({
						number,
						answers: incorrectAnswers  as unknown as number
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
			withTooltip={!isMobile}
			withLegend
		/>
	)
}
