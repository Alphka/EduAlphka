import type { Model, PopulatedDoc, Types } from "mongoose"
import type { IUser } from "./User"

export interface ISession {
	_id: Types.ObjectId
	token: string
	user: NonNullable<PopulatedDoc<IUser>>
	userAgent: string
	createdAt: Date
	expiresAt: Date
}

export type SessionModel = Model<ISession>
