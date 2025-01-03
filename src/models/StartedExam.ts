import type { IStartedExam, IStartedExamMethods, StartedExamModel } from "./typings/StartedExam"
import type { IExam, IExamMethods } from "./typings/Exam"
import { model, models, Schema, type HydratedDocument } from "mongoose"

const startedExamSchema = new Schema<IStartedExam, StartedExamModel, IStartedExamMethods>({
	user: {
		type: Schema.ObjectId,
		ref: "User"
	},
	exam: {
		type: Schema.ObjectId,
		ref: "Exam"
	},
	startedAt: {
		type: Date,
		default: Date.now,
		required: true
	}
}, {
	id: false,
	versionKey: false
})

startedExamSchema.method("isExpired", async function isExpired({
	exam
}: {
	exam?: HydratedDocument<Pick<IExam, "expiresAt" | "duration">> & IExamMethods
} = {}){
	if(!(exam && exam.expiresAt && exam.duration)){
		const { default: Exam } = await import("@models/Exam")

		if(!(exam && exam.expiresAt && exam.duration)){
			if(!exam && !this.exam) throw new Error("Missing 'exam' property in StartedExam")

			exam = (await Exam.findById(exam || this.exam, {
				duration: 1,
				expiresAt: 1
			}))!
		}
	}

	const submitExpirationDate = this.startedAt.getTime() + exam.duration * 60 * 1000

	return Date.now() > submitExpirationDate || exam.isExpired()
})

const StartedExam = models?.StartedExam as StartedExamModel || model<IStartedExam, StartedExamModel>("StartedExam", startedExamSchema)

export default StartedExam
