import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { Grid, GridCol } from "@mantine/core"
import { StartedExam } from "@models"
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

				const submit = startedExam?.submit || null

				let grade: number | null = 0
				let pendingCorrection = false

				if(submit){
					for(const answer of submit.answers){
						if(!("isCorrect" in answer) || answer.isCorrect === undefined) pendingCorrection = true
						else if(answer.isCorrect) grade++
					}
				}else{
					grade = null
				}

				return (
					<GridCol
						span={{
							base: 12,
							lg: 6,
							xl: 4
						}}
						key={exam.id}
					>
						<ExamCard
							startedExam={startedExam && StartedExam.hydrate(startedExam)}
							{...{ exam, submit, grade, pendingCorrection }}
						/>
					</GridCol>
				)
			})}
		</Grid>
	)
}
