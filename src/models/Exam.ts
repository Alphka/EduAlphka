import type {
	IExam,
	ExamModel,
	OptionModel,
	QuestionModel,
	IQuestionOption,
	ExamQuestionBase,
	ExamDissertativeQuestion,
	ExamMultipleChoiceQuestion
} from "./typings/Exam"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { model, models, Schema } from "mongoose"

export enum QuestionTypes {
	multiple_choice = "Múltipla escolha",
	dissertative = "Dissertativa"
}

const OptionSchema = new Schema<IQuestionOption, OptionModel>({
	text: {
		type: String,
		required: true
	}
})

const QuestionSchema = new Schema<
	& ExamQuestionBase
	& Omit<ExamMultipleChoiceQuestion, "type">
	& Omit<ExamDissertativeQuestion, "type">
, QuestionModel>({
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

export const examSchema = new Schema<IExam, ExamModel>({
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
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date,
	expiresAt: Date
})

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
