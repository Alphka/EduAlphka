import type { AnswerModel, IAnswer } from "./typings/Answer"
import { model, models, Schema } from "mongoose"
import { ExamFormValidation } from "@constants/forms"
import { QuestionTypes } from "./Exam"

const answerSchema = new Schema<IAnswer>({
	type: {
		type: String,
		enum: Object.keys(QuestionTypes),
		required: true
	},
	submit: {
		type: Schema.ObjectId,
		required: true,
		ref: "Submit"
	},
	question: {
		type: Schema.ObjectId,
		required: true
	},
	option: Schema.ObjectId,
	content: {
		type: String,
		minlength: ExamFormValidation.answerContentMinLength,
		maxlength: ExamFormValidation.answerContentMaxLength
	},
	isCorrect: Boolean,
	feedback: {
		type: String,
		minlength: ExamFormValidation.submitFeedbackMinLength,
		maxlength: ExamFormValidation.submitFeedbackMaxLength
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date
})

const Answer: AnswerModel = models?.Answer || model<IAnswer, AnswerModel>("Answer", answerSchema)

export default Answer
