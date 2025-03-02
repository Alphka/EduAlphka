import type { IExam, ExamModel, IExamMethods, StartedExamWithSubmit } from "../typings/Exam"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { QuestionSchema, QuestionTypes } from "./Question"
import { model, models, Schema, Types } from "mongoose"

const examSchema = new Schema<IExam, ExamModel, IExamMethods>({
	owner: {
		type: Schema.ObjectId,
		required: true,
		ref: "User"
	},
	title: {
		type: String,
		required: true,
		minlength: ExamFormValidation.titleMinLength,
		maxlength: ExamFormValidation.titleMaxLength
	},
	description: {
		type: String,
		required: true,
		minlength: ExamFormValidation.descriptionMinLength,
		maxlength: ExamFormValidation.descriptionMaxLength
	},
	subject: {
		type: String,
		minlength: GenericFormValidation.nameMinLength,
		maxlength: GenericFormValidation.nameMaxLength
	},
	duration: {
		type: Number,
		required: true
	},
	questions: [QuestionSchema],
	candidates: [{
		type: Schema.ObjectId,
		ref: "User"
	}],
	disallowedCandidates: [{
		type: Schema.ObjectId,
		ref: "User"
	}],
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date,
	expiresAt: Date,
	startsAt: Date
})

examSchema.method("isExpired", function isExpired(){
	return !!this.expiresAt && Date.now() > this.expiresAt.getTime()
})

examSchema.method("getSubmitData", async function getSubmitData(candidates: (Types.ObjectId | string) | (Types.ObjectId | string)[]){
	const { default: StartedExam } = await import("../StartedExam")

	const exam = await Exam
		.findById(this._id, { questions: 1 })
		.orFail(new Error("Exam not found"))

	const isMultipleCandidates = Array.isArray(candidates)

	const startedExamResult = await StartedExam.aggregate<Omit<StartedExamWithSubmit, "grade" | "pendingAnswers" | "pendingCorrection">>([
		{
			$match: {
				exam: this._id,
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

	const results = startedExamResult.map(async submitData => {
		if(!submitData) return null

		const requiredQuestions = exam.questions.filter(question => question.isRequired).map(question => question.id as string)
		const pendingCorrection = !submitData.submit?.publishedAt &&
			!!submitData.submit?.answers.some(answer => answer.type === "dissertative" && requiredQuestions.includes(answer.question.toString()))

		let pendingAnswers = 0
		let grade: number | null = 0

		if(submitData.submit){
			for(const answer of submitData.submit.answers){
				if(pendingCorrection && answer.type === "dissertative"){
					pendingAnswers++
					continue
				}

				if(answer.isCorrect) grade++
			}
		}else{
			grade = null
		}

		return {
			...submitData,
			grade,
			pendingAnswers,
			pendingCorrection
		} as StartedExamWithSubmit
	})

	return isMultipleCandidates ? Promise.all(results) : results[0]
})

examSchema.method("getAverageGrade", async function getAverageGrade(){
	const { default: Submit } = await import("../Submit")

	const result = await Submit.aggregate<{ averageGrade: number }>([
		{
			$match: {
				exam: this._id
			}
		},
		{
			$lookup: {
				from: "answers",
				localField: "_id",
				foreignField: "submit",
				as: "answers"
			}
		},
		{
			$unwind: "$answers"
		},
		{
			$group: {
				_id: "$_id",
				totalCorrect: {
					$sum: {
						$cond: ["$answers.isCorrect", 1, 0]
					}
				},
				totalQuestions: {
					$sum: 1
				}
			}
		},
		{
			$project: {
				grade: {
					$divide: [
						"$totalCorrect",
						"$totalQuestions"
					]
				}
			}
		},
		{
			$group: {
				_id: null,
				averageGrade: {
					$avg: "$grade"
				}
			}
		}
	])

	return result.length ? result[0].averageGrade : 0
})

examSchema.method("getQuestionCorrectPercentage", async function getQuestionCorrectPercentage(){
	const { default: Answer } = await import("../Answer")

	const result = await Answer.aggregate<{
		questionId: Types.ObjectId,
		totalAnswers: number,
		correctAnswers: number,
		correctPercentage: number
	}>([
		{
			$match: {
				question: {
					$in: this.questions.map(question => question._id)
				}
			}
		},
		{
			$group: {
				_id: "$question",
				totalAnswers: {
					$sum: 1
				},
				correctAnswers: {
					$sum: {
						$cond: ["$isCorrect", 1, 0]
					}
				}
			}
		},
		{
			$project: {
				questionId: "$_id",
				totalAnswers: "$totalAnswers",
				correctAnswers: "$correctAnswers",
				correctPercentage: {
					$multiply: [
						{ $divide: ["$correctAnswers", "$totalAnswers"] },
						100
					]
				}
			}
		}
	])

	return Object.fromEntries(result.map(({ questionId, totalAnswers, correctAnswers, correctPercentage }) => [
		questionId.toString(),
		{
			correctPercentage,
			correctAnswers,
			totalAnswers
		}
	]))
})

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
export { QuestionTypes }
