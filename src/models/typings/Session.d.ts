import type { DateType } from "."
import type { Model } from "mongoose"

export interface ISession {
	token: string
	userAgent: string
	createdAt: DateType
	expiresAt: DateType
}

export type SessionModel = Model<ISession>
