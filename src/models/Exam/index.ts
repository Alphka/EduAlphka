import type { IExam, ExamModel, IExamMethods } from "../typings/Exam"
import { ExamFormValidation, GenericFormValidation } from "@constants/forms"
import { model, models, Schema, type Types } from "mongoose"
import { QuestionSchema, QuestionTypes } from "./Question"

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

examSchema.method("submitInfo", async function submitInfo(){
	const [{ hasStartedBySomeone, hasSubmit }] = await Exam.aggregate<{
		_id: Types.ObjectId
		hasSubmit: boolean
		hasStartedBySomeone: boolean
	}>([
		{
			$match: {
				_id: this._id
			}
		},
		{
			$lookup: {
				from: "submits",
				localField: "_id",
				foreignField: "exam",
				as: "submits"
			}
		},
		{
			$lookup: {
				from: "startedexams",
				localField: "_id",
				foreignField: "exam",
				as: "startedExams"
			}
		},
		{
			$project: {
				hasSubmit: { $gt: [{ $size: "$submits" }, 0] },
				hasStartedBySomeone: { $gt: [{ $size: "$startedExams" }, 0] }
			}
		}
	])

	return {
		hasSubmit,
		hasStartedBySomeone
	}
})

const Exam = models?.Exam as ExamModel || model<IExam, ExamModel>("Exam", examSchema)

export default Exam
export { QuestionTypes }
