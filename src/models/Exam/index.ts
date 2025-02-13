import type { IExam, ExamModel, IExamMethods, StartedExamWithSubmit } from "../typings/Exam"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { QuestionSchema, QuestionTypes } from "./Question"
import { model, models, Schema, Types } from "mongoose"

const examSchema = new Schema<IExam, ExamModel, IExamMethods>({
	owner: {
		type: Schema.ObjectId,
		ref: "User",
		required: true
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

		const pendingCorrection = submitData.submit?.answers.some(answer => answer.type === "dissertative") && !submitData.submit.publishedAt

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

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
export { QuestionTypes }
