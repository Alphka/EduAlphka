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

export interface StartedExamWithSubmit extends IStartedExam {
	exam: Types.ObjectId
	user: Types.ObjectId
	submit?: SubmitWithAnswers
	/** Is null if the exam was not submitted */
	grade: number | null
	pendingCorrection: boolean
}

export default async function getExamSubmitData(examId: Id, candidate: Id): Promise<StartedExamWithSubmit | null>
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

	const results = startedExamResult.map(startedExam => {
		if(!startedExam) return null

		const pendingCorrection = !!startedExam?.submit && !startedExam?.submit.publishedAt

		let pendingAnswers = 0
		let grade: number | null = 0

		if(startedExam.submit){
			for(const answer of startedExam.submit.answers){
				if(pendingCorrection && answer.type === "dissertative"){
					pendingAnswers++
					continue
				}

				//? This should not happen
				if(answer.isCorrect === undefined) pendingAnswers++
				else if(answer.isCorrect) grade++
			}
		}else{
			grade = null
		}

		return {
			...startedExam,
			grade,
			pendingCorrection
		}
	})

	return isMultipleCandidates ? results : results[0]
}
