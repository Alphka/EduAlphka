import type { Model, Types } from "mongoose"

export interface ISession {
	token: string
	user: Types.ObjectId
	userAgent: string
	createdAt: Date
	expiresAt: Date
}

export type SessionModel = Model<ISession>
