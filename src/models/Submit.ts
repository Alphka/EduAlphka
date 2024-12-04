import type { ISubmit, SubmitModel } from "./typings/Submit"
import { model, models, Schema } from "mongoose"
import Answer from "./Answer"

const submitSchema = new Schema<ISubmit>({
	user: {
		type: Schema.ObjectId,
		ref: "User",
		required: true
	},
	exam: {
		type: Schema.ObjectId,
		ref: "Exam",
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	}
}, { versionKey: false })

submitSchema.method("getAnswers", function getAnswers(){
	return Answer.find({ submit: this.id })
})

const Submit: SubmitModel = models?.Submit || model<ISubmit, SubmitModel>("Submit", submitSchema)

export default Submit
