import type { Model, Types } from "mongoose"
import type { DateType } from "."

export interface ISession {
	token: string
	user: Types.ObjectId
	userAgent: string
	createdAt: DateType
	expiresAt: DateType
}

export type SessionModel = Model<ISession>
