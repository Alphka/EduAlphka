import type { Exam } from "@models"
import { Grid, GridCol } from "@mantine/core"
import formatTimeDuration from "@helpers/formatTimeDuration"
import ExamCard from "./ExamCard"

interface ExamListProps {
	exams: InstanceType<typeof Exam>[]
}

export default async function ExamList({ exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(exam => {
				const id = exam._id.toString()

				return (
					<GridCol
						span={{
							base: 12,
							md: 6,
							lg: 4
						}}
						key={id}
					>
						<ExamCard
							title={exam.title}
							active
							examId={id}
							subject={exam.subject}
							duration={formatTimeDuration(exam.duration)}
							createdAt={exam.createdAt}
							updatedAt={exam.updatedAt}
							description={exam.description}
							candidatesCount={exam.candidates.length}
						/>
					</GridCol>
				)
			})}
		</Grid>
	)
}
