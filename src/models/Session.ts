import type { ISession, SessionModel } from "./typings/Session"
import { model, models, Schema } from "mongoose"

export const sessionSchema = new Schema<ISession>({
	token: {
		type: String,
		unique: true,
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
}, { _id: false, versionKey: false })

const Session: SessionModel = models?.Session || model<ISession, SessionModel>("Session", sessionSchema)

export default Session
