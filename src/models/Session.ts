import type { ISession, SessionModel } from "./typings/Session"
import { model, models, Schema } from "mongoose"

export const sessionSchema = new Schema<ISession, SessionModel>({
	token: {
		type: String,
		unique: true,
		required: true
	},
	user: {
		type: Schema.ObjectId,
		ref: "User",
		required: true
	},
	userAgent: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	expiresAt: {
		type: Date,
		required: true
	}
}, {
	versionKey: false
})

const Session = models?.Session as SessionModel || model<ISession, SessionModel>("Session", sessionSchema)

export default Session
