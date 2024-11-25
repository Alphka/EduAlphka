import type { AnswerModel, IAnswer } from "./typings/Answer"
import { model, models, Schema } from "mongoose"
import { QUESTION_TYPES } from "./Exam"

export const answerSchema = new Schema<IAnswer>({
	type: {
		type: String,
		enum: QUESTION_TYPES.types,
		required: true
	},
	submit: {
		type: Schema.ObjectId,
		ref: "Submit",
		required: true
	},
	question: {
		type: String,
		required: true
	},
	option: Schema.ObjectId,
	content: String,
	isCorrect: Boolean,
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

const Answer: AnswerModel = models?.Answer || model<IAnswer, AnswerModel>("Answer", answerSchema)

export default Answer
