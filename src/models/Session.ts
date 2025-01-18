import type { ISession, SessionModel } from "./typings/Session"
import { model, models, Schema } from "mongoose"
import { TOKEN_LENGTH } from "@constants"

export const sessionSchema = new Schema<ISession, SessionModel>({
	token: {
		type: String,
		unique: true,
		required: true,
		minlength: TOKEN_LENGTH,
		maxlength: TOKEN_LENGTH
	},
	user: {
		type: Schema.ObjectId,
		ref: "User",
		required: true
	},
	userAgent: {
		type: String,
		required: true,
		maxlength: 255
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
}, { versionKey: false })

const Session = models?.Session as SessionModel || model<ISession, SessionModel>("Session", sessionSchema)

export default Session
