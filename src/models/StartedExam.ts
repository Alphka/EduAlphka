import type { IStartedExam, IStartedExamMethods, StartedExamModel } from "./typings/StartedExam"
import { Document, model, models, Schema, Types } from "mongoose"

const startedExamSchema = new Schema<IStartedExam, StartedExamModel, IStartedExamMethods>({
	user: {
		type: Schema.ObjectId,
		ref: "User"
	},
	exam: {
		type: Schema.ObjectId,
		ref: "Exam"
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	}
}, { versionKey: false })

startedExamSchema.method("isExpired", async function isExpired({ exam: _exam }: {
	checkExam?: boolean
	exam?: string | Types.ObjectId | Document
} = {}){
	const { default: Exam } = await import("./Exam")

	if(_exam instanceof Document && !Types.ObjectId.isValid(_exam._id as Types.ObjectId)){
		if(!this.exam) throw new Error("Invalid exam document given for StartedExam.isExpired() function")
		_exam = undefined
	}

	if(
		_exam && !(
			_exam instanceof Document ||
			_exam instanceof Types.ObjectId ||
			Types.ObjectId.isValid(_exam)
		)
	){
		throw new Error("Invalid exam object given for StartedExam.isExpired() function")
	}

	if(!_exam && !this.exam){
		throw new Error("Missing 'exam' property in StartedExam.isExpired() function")
	}

	const exam = await Exam
		.findById(_exam || this.exam, {
			duration: 1,
			expiresAt: 1
		})
		.orFail()

	const submitExpirationDate = this.createdAt.getTime() + exam.duration * 60 * 1000

	return Date.now() > submitExpirationDate || exam.isExpired()
})

const StartedExam = models?.StartedExam as StartedExamModel || model<IStartedExam, StartedExamModel>("StartedExam", startedExamSchema)

export default StartedExam
