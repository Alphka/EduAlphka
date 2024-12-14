import type { IStartedExam, IStartedExamMethods, StartedExamModel } from "./typings/StartedExam"
import type Submit from "./Submit"
import type Exam from "./Exam"
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
	_id: false,
	versionKey: false
})

startedExamSchema.method("isExpired", async function isExpired({
	exam,
	submit
}: {
	exam?: InstanceType<typeof Exam>,
	submit?: InstanceType<typeof Submit> | null
} = {}){
	if(!exam || !submit){
		const [Exam, Submit] = await Promise.all([
			import("@models/Exam").then(module => module.default),
			import("@models/Submit").then(module => module.default)
		])

		if(!exam) exam = (await Exam.findById(this.exam))!
		if(submit === undefined) submit = await Submit.findOne({ exam: exam._id })
	}

	if(submit) return false

	const currentDate = Date.now()
	const submitExpirationDate = this.startedAt.getTime() + exam.duration * 60 * 1000

	return currentDate > submitExpirationDate || !!exam.expiresAt && currentDate > exam.expiresAt.getTime()
})

const StartedExam = models?.StartedExam as StartedExamModel || model<IStartedExam, StartedExamModel>("StartedExam", startedExamSchema)

export default StartedExam
