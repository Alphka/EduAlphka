import type { Exam } from "@models"
import { Grid, GridCol } from "@mantine/core"
import formatTimeDuration from "@helpers/formatTimeDuration"
import ExamCard from "../ExamCard"

interface ExamListProps {
	exams: InstanceType<typeof Exam>[]
}

export default async function ExamList({ exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(({
				_id,
				title,
				description,
				subject,
				duration,
				candidates,
				createdAt,
				updatedAt
			}) => {
				const id = _id.toString()

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
							title={title}
							active
							examId={id}
							subject={subject}
							duration={formatTimeDuration(duration)}
							createdAt={createdAt}
							updatedAt={updatedAt}
							description={description}
							candidatesCount={candidates.length}
						/>
					</GridCol>
				)
			})}
		</Grid>
	)
}
