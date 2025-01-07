import type { MixedExamQuestion, QuestionModel } from "../typings/Exam"
import { ExamFormValidation } from "@constants/forms"
import { OptionSchema } from "./Option"
import { Schema } from "mongoose"

export enum QuestionTypes {
	multiple_choice = "Múltipla escolha",
	dissertative = "Dissertativa"
}

export const QuestionSchema = new Schema<MixedExamQuestion, QuestionModel>({
	type: {
		type: String,
		enum: Object.keys(QuestionTypes),
		required: true
	},
	text: {
		type: String,
		required: true,
		minlength: ExamFormValidation.questionTextMinLength,
		maxlength: ExamFormValidation.questionTextMaxLength
	},
	isRequired: {
		type: Boolean,
		required: true
	},
	options: [OptionSchema],
	correctAnswer: Schema.ObjectId
})
