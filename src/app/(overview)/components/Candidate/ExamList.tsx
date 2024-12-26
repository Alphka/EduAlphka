import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { IStartedExam } from "@models/typings/StartedExam"
import type { IAnswer } from "@models/typings/Answer"
import type { ISubmit } from "@models/typings/Submit"
import type { IUser } from "@models/typings/User"
import { Types, type Document, type HydratedDocument } from "mongoose"
import { Grid, GridCol } from "@mantine/core"
import { StartedExam } from "@models"
import ExamCard from "./ExamCard"

export interface ExamListProps {
	userId: string
	exams: (Document & Omit<IExam, "owner"> & { owner: HydratedDocument<Pick<IUser, "name" | "username">> } & IExamMethods)[]
}

export default async function ExamList({ userId, exams }: ExamListProps){
	return (
		<Grid gutter="md">
			{exams.map(async exam => {
				const startedExam = await StartedExam.aggregate<(HydratedDocument<IStartedExam> & {
					submit?: (HydratedDocument<ISubmit> & {
						answers: HydratedDocument<IAnswer>[]
					})
				}) | null>([
					{
						$match: {
							exam: exam._id,
							user: new Types.ObjectId(userId)
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
