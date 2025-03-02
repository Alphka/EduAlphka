"use client"

import { useMediaQuery } from "@mantine/hooks"
import { PieChart } from "@mantine/charts"
import { Box } from "@mantine/core"
import tailwindConfig from "@root/tailwind.config"

interface GradesChartProps {
	totalCorrectAnswers: number
	totalIncorrectAnswers: number
}

export default function GradesPieChart({ totalCorrectAnswers, totalIncorrectAnswers }: GradesChartProps){
	const isMobile = useMediaQuery(`(max-width: ${tailwindConfig.theme.screens.lg})`)

	return (
		<div className="h-full flex flex-col items-center justify-center gap-md">
			<PieChart
				size={isMobile ? 80 : 100}
				data={[
					{ name: "Acertos", value: totalCorrectAnswers, color: "blue.6" },
					{ name: "Erros", value: totalIncorrectAnswers, color: "red.6" },
				]}
				strokeWidth={2}
				withTooltip
				tooltipDataSource="segment"
				withLabels
				withLabelsLine
				labelsType="percent"
				labelsPosition="outside"
			/>

			<div className="self-stretch flex flex-col px-sm gap-md leading-none">
				<div className="flex items-center gap-sm">
					<Box bg="blue.6" w={10} h={10} className="rounded-full" />
					Acertos
				</div>
				<div className="flex items-center gap-sm">
					<Box bg="red.6" w={10} h={10} className="rounded-full" />
					Erros
				</div>
			</div>
		</div>
	)
}
