import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { HydratedDocument } from "mongoose"
import { Grid, GridCol } from "@mantine/core"
import ExamCard from "./ExamCard"

interface ExamListProps {
	exams: (HydratedDocument<IExam> & IExamMethods)[]
}

export default async function ExamList({ exams }: ExamListProps){
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
					<ExamCard exam={exam} />
				</GridCol>
			))}
		</Grid>
	)
}
