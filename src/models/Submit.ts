import type { ISubmit, ISubmitMethods, SubmitModel } from "./typings/Submit"
import { model, models, Schema } from "mongoose"

const submitSchema = new Schema<ISubmit, SubmitModel, ISubmitMethods>({
	user: {
		type: Schema.ObjectId,
		required: true,
		ref: "User"
	},
	exam: {
		type: Schema.ObjectId,
		required: true,
		ref: "Exam"
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	publishedAt: Date
})

submitSchema.method("getAnswers", async function getAnswers(){
	const { default: Answer } = await import("./Answer")
	return Answer.find({ submit: this })
})

submitSchema.method("isPendingCorrection", async function isPendingCorrection(){
	const answers = await this.getAnswers()
	return answers.some(answer => !("isCorrect" in answer) || answer.isCorrect === undefined)
})

const Submit: SubmitModel = models?.Submit || model<ISubmit, SubmitModel>("Submit", submitSchema)

export default Submit
