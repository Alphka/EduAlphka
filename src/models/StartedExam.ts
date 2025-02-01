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
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	}
}, { versionKey: false })

startedExamSchema.method("isExpired", async function isExpired({
	exam
}: {
	exam?: HydratedDocument<Pick<IExam, "expiresAt" | "duration">> & IExamMethods
} = {}){
	if(exam && typeof exam !== "object") throw new Error("Invalid exam object given for StartedExam.isExpired() function")

	if(!exam && !this.exam) throw new Error("Missing 'exam' property in StartedExam")

	if(!exam || !exam.expiresAt || !exam.duration){
		if(
			this.exam &&
			"expiresAt" in this.exam && this.exam.expiresAt instanceof Date &&
			"duration" in this.exam && typeof this.exam.duration === "number"
		){
			let _exam = this.exam

			if(!("isExpired" in this.exam)){
				const { default: Exam } = await import("./Exam")
				_exam = Exam.hydrate(_exam)
			}

			exam = _exam as unknown as HydratedDocument<Pick<IExam, "expiresAt" | "duration">> & IExamMethods
		}else{
			const { default: Exam } = await import("./Exam")

			if(!exam || !exam.expiresAt || !exam.duration){
				if(!exam && !this.exam?._id) throw new Error("No exam found for StartedExam")

				exam = await Exam
					.findById(exam || this.exam, {
						duration: 1,
						expiresAt: 1
					})
					.orFail()
			}
		}
	}

	const submitExpirationDate = this.createdAt.getTime() + exam.duration * 60 * 1000

	return Date.now() > submitExpirationDate || exam.isExpired()
})

const StartedExam = models?.StartedExam as StartedExamModel || model<IStartedExam, StartedExamModel>("StartedExam", startedExamSchema)

export default StartedExam
