import type { IExam, ExamModel, IExamMethods, StartedExamWithSubmit, ExamQuestion } from "../typings/Exam"
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
	const [{ default: StartedExam }] = await Promise.all([
		import("../StartedExam"),
		import("../Submit"),
		import("../Answer")
	])

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

examSchema.method("getGradesByCandidate", async function getGradesByCandidate(){
	const { default: Submit } = await import("../Submit")

	let questions: ExamQuestion[] = this.questions

	if(!("questions" in this) || !Array.isArray(this.questions)){
		const exam = await Exam.findById(this._id, { questions: 1 })
			.orFail(new Error("Exam not found"))
			.lean()

		questions = exam.questions as typeof questions
	}

	const hasRequiredDissertative = questions.some(question => question.isRequired && question.type === "dissertative")

	const result = await Submit.aggregate<{ user: string, grade: number }>([
		{
			$match: {
				exam: this._id,
				...(hasRequiredDissertative && {
					publishedAt: {
						$exists: true
					}
				})
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
			$match: {
				"answers.question": {
					$in: questions
						.filter(question => question.isRequired)
						.map(question => question._id)
				}
			}
		},
		{
			$group: {
				_id: "$user",
				totalCorrect: {
					$sum: {
						$cond: ["$answers.isCorrect", 1, 0]
					}
				}
			}
		},
		{
			$project: {
				_id: 0,
				user: "$_id",
				grade: "$totalCorrect"
			}
		}
	])

	return Object.fromEntries(result.map(({ user, grade }) => [user.toString(), { grade }]))
})

examSchema.method("getAverageGrade", async function getAverageGrade(){
	const { default: Submit } = await import("../Submit")

	let questions: ExamQuestion[] = this.questions

	if(!("questions" in this) || !Array.isArray(this.questions)){
		const exam = await Exam.findById(this._id, { questions: 1 })
			.orFail(new Error("Exam not found"))
			.lean()

		questions = exam.questions as typeof questions
	}

	const hasRequiredDissertative = questions.some(question => question.isRequired && question.type === "dissertative")

	const result = await Submit.aggregate<{ averageGrade: number }>([
		{
			$match: {
				exam: this._id,
				...(hasRequiredDissertative && {
					publishedAt: {
						$exists: true
					}
				})
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
				}
			}
		},
		{
			$group: {
				_id: null,
				totalCorrect: {
					$sum: "$totalCorrect"
				},
				totalCandidates: {
					$sum: 1
				}
			}
		},
		{
			$project: {
				_id: 0,
				averageGrade: {
					$divide: ["$totalCorrect", "$totalCandidates"]
				}
			}
		}
	])

	return result.length ? result[0].averageGrade : 0
})

examSchema.method("getQuestionCorrectPercentage", async function getQuestionCorrectPercentage(){
	const { default: Answer } = await import("../Answer")

	let questions: ExamQuestion[] = this.questions

	if(!("questions" in this) || !Array.isArray(this.questions)){
		const exam = await Exam.findById(this._id, { questions: 1 })
			.orFail(new Error("Exam not found"))
			.lean()

		questions = exam.questions as typeof questions
	}

	const result = await Answer.aggregate<{
		questionId: Types.ObjectId,
		totalAnswers: number,
		correctAnswers: number,
		correctPercentage: number
	}>([
		{
			$match: {
				question: {
					$in: questions
						.filter(question => question.isRequired)
						.map(question => question._id)
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
				_id: 0,
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
		{ correctPercentage, correctAnswers, totalAnswers }
	]))
})

examSchema.method("getAverageCompletionTime", async function getAverageCompletionTime(){
	const [{ default: StartedExam }] = await Promise.all([
		import("../StartedExam"),
		import("../Submit")
	])

	const result = await StartedExam.aggregate<{ averageTime: number }>([
		{
			$match: {
				exam: this._id
			}
		},
		{
			$lookup: {
				from: "submits",
				localField: "user",
				foreignField: "user",
				let: {
					examId: "$exam"
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ["$exam", "$$examId"]
							}
						}
					},
					{
						$project: {
							user: 1,
							createdAt: 1
						}
					}
				],
				as: "submit"
			}
		},
		{
			$unwind: "$submit"
		},
		{
			$set: {
				completionTime: {
					$subtract: ["$submit.createdAt", "$createdAt"]
				}
			}
		},
		{
			$group: {
				_id: null,
				averageTime: {
					$avg: "$completionTime"
				}
			}
		}
	])

	return result.length ? result[0].averageTime : 0
})

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
export { QuestionTypes }
