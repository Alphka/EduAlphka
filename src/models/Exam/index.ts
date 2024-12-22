import type { IExam, ExamModel, IExamMethods } from "../typings/Exam"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { QuestionSchema, QuestionTypes } from "./Question"
import { model, models, Schema } from "mongoose"

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
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date,
	expiresAt: Date
})

examSchema.method("isExpired", function isExpired(){
	return !!this.expiresAt && Date.now() > this.expiresAt.getTime()
})

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
export { QuestionTypes }
