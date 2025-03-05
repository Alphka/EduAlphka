import type { ISubmit, SubmitModel } from "./typings/Submit"
import { model, models, Schema } from "mongoose"

const submitSchema = new Schema<ISubmit, SubmitModel>({
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

const Submit: SubmitModel = models?.Submit || model<ISubmit, SubmitModel>("Submit", submitSchema)

export default Submit
