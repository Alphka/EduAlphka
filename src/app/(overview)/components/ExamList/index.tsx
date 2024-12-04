import type { ComponentPropsWithoutRef } from "react"
import type { HydratedDocument } from "mongoose"
import type { IExam } from "@models/typings/Exam"
import { Grid, GridCol } from "@mantine/core"
import ExamCard from "../ExamCard"

interface ExamListProps {
	exams: HydratedDocument<(IExam | ComponentPropsWithoutRef<typeof ExamCard>) & Pick<IExam, "candidates">>[]
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
						active
						title={title}
						subject={subject}
						description={description}
						createdAt={createdAt as Date}
						updatedAt={updatedAt as Date | undefined}
						candidatesCount={candidates.length}
					/>
				</GridCol>
			))}
		</Grid>
	)
}
