import type { IStartedExam, IStartedExamMethods, StartedExamModel } from "./typings/StartedExam"
import type { IExam, IExamMethods } from "./typings/Exam"
import type { ISubmit } from "./typings/Submit"
import { model, models, Schema } from "mongoose"

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
	exam,
	submit
}: {
	exam?: Document & IExam & IExamMethods
	submit?: (Document & ISubmit) | boolean | null
} = {}){
	if(!(exam && exam.expiresAt && exam.duration) || !submit){
		const [Exam, Submit] = await Promise.all([
			import("@models/Exam").then(module => module.default),
			import("@models/Submit").then(module => module.default)
		])

		if(!(exam && exam.expiresAt && exam.duration)){
			if(!exam && !this.exam) throw new Error("Missing 'exam' property in StartedExam")

			exam = (await Exam.findById(exam || this.exam, {
				duration: 1,
				expiresAt: 1
			}))!
		}

		if(submit === undefined) submit = !!(await Submit.exists({ exam }))
	}

	if(submit) return false

	const currentDate = Date.now()
	const submitExpirationDate = this.startedAt.getTime() + exam.duration * 60 * 1000

	return currentDate > submitExpirationDate || exam.isExpired()
})

const StartedExam = models?.StartedExam as StartedExamModel || model<IStartedExam, StartedExamModel>("StartedExam", startedExamSchema)

export default StartedExam
