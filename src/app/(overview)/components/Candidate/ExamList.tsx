import type { ParticipatingExamsProps } from "../../(dashboard)/components/CandidateDashboard/ParticipatingExams"
import type { IStartedExam } from "@models/typings/StartedExam"
import type { IAnswer } from "@models/typings/Answer"
import type { ISubmit } from "@models/typings/Submit"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { Types, type Document, type HydratedDocument } from "mongoose"
import { Grid, GridCol } from "@mantine/core"
import { StartedExam } from "@models"
import ExamCard from "./ExamCard"

interface ExamListProps extends Pick<ParticipatingExamsProps, "user"> {
	exams: (Document & Omit<IExam, "owner"> & { owner: HydratedDocument<IUser> })[]
}

export default async function ExamList({ user, exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(async exam => {
				const startedExam = await StartedExam.aggregate<(HydratedDocument<IStartedExam> & {
					submit: (HydratedDocument<ISubmit> & {
						answers: HydratedDocument<IAnswer>[]
					}) | null
				}) | null>([
					{
						$match: {
							exam: exam._id,
							user: new Types.ObjectId(user.id)
						}
					},
					{
						$lookup: {
							as: "submit",
							from: "submits",
							let: {
								userId: "$user",
								examId: "$exam"
							},
							pipeline: [
								{
									$match: {
										$expr: {
											$and: [
												{ $eq: ["$user", "$$userId"] },
												{ $eq: ["$exam", "$$examId"] }
											]
										}
									}
								},
								{
									$lookup: {
										as: "answers",
										from: "answers",
										localField: "_id",
										foreignField: "submit"
									}
								},
								{
									$limit: 1
								}
							]
						}
					},
					{
						$set: {
							submit: { $arrayElemAt: ["$submit", 0] }
						}
					},
					{
						$limit: 1
					}
				]).then(result => result[0] || null)

				const hasSubmit = !!startedExam?.submit
				const pendingCorrection = hasSubmit && startedExam.submit!.answers.some(answer => !("isCorrect" in answer) || answer.isCorrect === undefined)

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
							pendingCorrection={pendingCorrection}
							startedExam={startedExam && StartedExam.hydrate(startedExam)}
							submit={startedExam?.submit || null}
							exam={exam}
						/>
					</GridCol>
				)
			})}
		</Grid>
	)
}
