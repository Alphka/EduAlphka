import type { Model, PopulatedDoc, Types } from "mongoose"
import type { IUser } from "./User"

export interface IVerificationCode {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<IUser>>
	code: string
	createdAt: Date
	expiresAt: Date
}

export type VerificationCodeModel = Model<IVerificationCode>
