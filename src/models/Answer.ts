import type { AnswerModel, IAnswer } from "./typings/Answer"
import { model, models, Schema } from "mongoose"
import { questionTypes } from "./Exam"

export const answerSchema = new Schema<IAnswer>({
	type: {
		type: String,
		enum: questionTypes.types,
		required: true
	},
	submit: {
		type: Schema.ObjectId,
		ref: "Submit",
		required: true
	},
	question: {
		type: Schema.ObjectId,
		required: true
	},
	option: String,
	content: String,
	isCorrect: Boolean,
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		required: true
	}
})

const Answer: AnswerModel = models?.Answer || model<IAnswer, AnswerModel>("Answer", answerSchema)

export default Answer
