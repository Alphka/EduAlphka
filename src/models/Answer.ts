import type { AnswerModel, IAnswer } from "./typings/Answer"
import { model, models, Schema } from "mongoose"
import { QuestionTypes } from "./Exam"

export const answerSchema = new Schema<IAnswer>({
	type: {
		type: String,
		enum: Object.keys(QuestionTypes),
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
	option: Schema.ObjectId,
	content: String,
	isCorrect: Boolean,
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date
})

const Answer: AnswerModel = models?.Answer || model<IAnswer, AnswerModel>("Answer", answerSchema)

export default Answer
