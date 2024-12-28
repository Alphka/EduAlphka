import type { IExamInvite, ExamInviteModel } from "./typings/ExamInvite"
import { model, models, Schema, type UpdateWithAggregationPipeline } from "mongoose"

export const examInviteSchema = new Schema<IExamInvite, ExamInviteModel>({
	token: {
		type: String,
		unique: true,
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
})

examInviteSchema.pre("updateOne", function updateOneMiddleware(){
	const update = this.getUpdate() as NonNullable<Exclude<ReturnType<typeof this.getUpdate>, UpdateWithAggregationPipeline>>

	if("__v" in update) delete update.__v

	const keys = ["$set", "$setOnInsert"] as const

	for(const key of keys){
		if(update[key] && "__v" in update[key]){
			delete update[key].__v
			if(!Object.keys(update[key]).length) delete update[key]
		}
	}

	update.$inc ||= {}
	update.$inc.__v = 1
})

const ExamInvite = models?.ExamInvite as ExamInviteModel || model<IExamInvite, ExamInviteModel>("ExamInvite", examInviteSchema)

export default ExamInvite
