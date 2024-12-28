import type { Model, PopulatedDoc } from "mongoose"
import type { IUser } from "./User"

export interface ISession {
	token: string
	user: NonNullable<PopulatedDoc<IUser>>
	userAgent: string
	createdAt: Date
	expiresAt: Date
}

export type SessionModel = Model<ISession>
