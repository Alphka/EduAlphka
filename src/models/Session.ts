import type { ISession, ISessionQueryHelpers, SessionModel } from "./typings/Session"
import { model, models, Schema, type HydratedDocument, type QueryWithHelpers } from "mongoose"

export const sessionSchema = new Schema<ISession, SessionModel, {}, ISessionQueryHelpers>({
	token: {
		type: String,
		unique: true,
		required: true
	},
	userId: {
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
	_id: false,
	versionKey: false,
	query: {
		byToken(
			this: QueryWithHelpers<any, HydratedDocument<ISession>, ISessionQueryHelpers>,
			token: string
		){
			return this.find({ token })
		}
	}
})

const Session = models?.Session as SessionModel || model<ISession, SessionModel>("Session", sessionSchema)

export default Session
