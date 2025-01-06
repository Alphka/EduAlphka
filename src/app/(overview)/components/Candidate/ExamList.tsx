import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { Grid, GridCol } from "@mantine/core"
import getExamSubmitData from "@app/(overview)/exam/helpers/getSubmitData"
import ExamCard from "./ExamCard"

export interface ExamListProps {
	userId: string
	exams: (HydratedDocument<Omit<IExam, "owner">> & {
		owner: HydratedDocument<Pick<IUser, "name" | "username">>
	} & IExamMethods)[]
}

export default async function ExamList({ userId, exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(async exam => {
				const startedExam = await getExamSubmitData(exam._id, userId)

				return (
					<GridCol
						span={{
							base: 12,
							lg: 6,
							xl: 4
						}}
						key={exam.id}
					>
						<ExamCard {...{ exam, startedExam }} />
					</GridCol>
				)
			})}
		</Grid>
	)
}
