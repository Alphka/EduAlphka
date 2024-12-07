import type { Exam } from "@models"
import { Grid, GridCol } from "@mantine/core"
import ExamCard from "../ExamCard"

interface ExamListProps {
	exams: InstanceType<typeof Exam>[]
}

export default async function ExamList({ exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(({ id, title, description, subject, candidates, createdAt, updatedAt }) => (
				<GridCol
					span={{
						base: 12,
						md: 6,
						lg: 4
					}}
					key={id}
				>
					<ExamCard
						title={title}
						active
						examId={id}
						subject={subject}
						createdAt={createdAt}
						updatedAt={updatedAt}
						description={description}
						candidatesCount={candidates.length}
					/>
				</GridCol>
			))}
		</Grid>
	)
}
