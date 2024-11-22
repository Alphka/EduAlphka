import type { HydratedDocument, Model, ObjectId, QueryWithHelpers } from "mongoose"
import type { DateType } from "."

export interface ISession {
	token: string
	userId: ObjectId
	userAgent: string
	createdAt: DateType
	expiresAt: DateType
}

export interface ISessionQueryHelpers {
	byToken: (token: string) => QueryWithHelpers<
		HydratedDocument<ISession>[],
		HydratedDocument<ISession>,
		ISessionQueryHelpers
	>
}

export type SessionModel = Model<ISession, ISessionQueryHelpers>
