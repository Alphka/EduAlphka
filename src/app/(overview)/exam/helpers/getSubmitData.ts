import type { IStartedExam } from "@models/typings/StartedExam"
import type { ISubmit } from "@models/typings/Submit"
import type { IAnswer } from "@models/typings/Answer"
import { StartedExam } from "@models"
import { Types } from "mongoose"

type Id = Types.ObjectId | string

interface SubmitWithAnswers extends ISubmit {
	exam: Types.ObjectId
	user: Types.ObjectId
	answers: IAnswer[]
}

interface StartedExamWithSubmit extends IStartedExam {
	exam: Types.ObjectId
	user: Types.ObjectId
	submit?: SubmitWithAnswers
}

export default async function getExamSubmitData(examId: Id, candidate: Id): Promise<StartedExamWithSubmit>
export default async function getExamSubmitData(examId: Id, candidates: Id[]): Promise<StartedExamWithSubmit[]>
export default async function getExamSubmitData(examId: Id, candidates: Id | Id[]){
	const isMultipleCandidates = Array.isArray(candidates)

	const startedExamResult = await StartedExam.aggregate<StartedExamWithSubmit>([
		{
			$match: {
				exam: new Types.ObjectId(examId),
				user: isMultipleCandidates
					? { $in: candidates.map(id => new Types.ObjectId(id)) }
					: new Types.ObjectId(candidates)
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
				submit: {
					$arrayElemAt: ["$submit", 0]
				}
			}
		}
	])

	return isMultipleCandidates
		? startedExamResult
		: startedExamResult[0] || null
}
