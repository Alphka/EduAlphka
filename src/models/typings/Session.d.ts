import type { Model, ObjectId } from "mongoose"
import type { DateType } from "."

export interface ISession {
	token: string
	user: ObjectId
	userAgent: string
	createdAt: DateType
	expiresAt: DateType
}

export type SessionModel = Model<ISession>
