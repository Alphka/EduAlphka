import type { ComponentPropsWithoutRef } from "react"
import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { HydratedDocument } from "mongoose"
import type Link from "next/link"
import { Grid, GridCol } from "@mantine/core"
import ExamCard from "./ExamCard"

interface ExamListProps extends Pick<ComponentPropsWithoutRef<typeof Link>, "prefetch"> {
	exams: (HydratedDocument<IExam> & IExamMethods)[]
}

export default async function ExamList({ exams, prefetch }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(exam => (
				<GridCol
					span={{
						base: 12,
						lg: 6,
						xl: 4
					}}
					key={exam.id}
				>
					<ExamCard {...{ exam, prefetch }} />
				</GridCol>
			))}
		</Grid>
	)
}
