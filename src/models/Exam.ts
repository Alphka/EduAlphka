import type {
	IExam,
	ExamModel,
	IExamQuestion,
	QuestionModel,
	OptionModel,
	TQuestionOption,
	ExamMultipleChoiceQuestion,
	ExamDissertativeQuestion
} from "./typings/Exam"
import { model, models, Schema } from "mongoose"

export enum QuestionTypes {
	multiple_choice = "Múltipla escolha",
	dissertative = "Dissertativa"
}

const OptionSchema = new Schema<TQuestionOption, OptionModel>({
	text: {
		type: String,
		required: true
	}
})

const QuestionSchema = new Schema<
	& IExamQuestion
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
		required: true
	},
	isRequired: {
		type: Boolean,
		// required: true
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
		required: true
	},
	description: {
		type: String,
		required: true
	},
	subject: String,
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
