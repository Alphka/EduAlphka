import type { Document, HydratedDocument } from "mongoose"
import type { ParticipatingExamsProps } from "../../(dashboard)/components/CandidateDashboard/ParticipatingExams"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { StartedExam, Submit } from "@models"
import { Grid, GridCol } from "@mantine/core"
import ExamCard from "./ExamCard"

interface ExamListProps extends Pick<ParticipatingExamsProps, "user"> {
	exams: (Document & Omit<IExam, "owner"> & { owner: HydratedDocument<IUser> })[]
}

export default async function ExamList({ user, exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(async exam => {
				const [startedExam, submit] = await Promise.all([
					StartedExam.findOne({
						user: user.id,
						exam: exam._id
					}),
					Submit.findOne({
						user: user.id,
						exam: exam._id
					})
				])

				const pendingCorrection = submit ? await submit.isPendingCorrection() : false

				return (
					<GridCol
						span={{
							base: 12,
							md: 6,
							lg: 4
						}}
						key={exam.id}
					>
						<ExamCard
							pendingCorrection={pendingCorrection}
							startedExam={startedExam}
							submit={submit}
							exam={exam}
						/>
					</GridCol>
				)
			})}
		</Grid>
	)
}
