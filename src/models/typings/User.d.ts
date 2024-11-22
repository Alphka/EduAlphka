import type { HydratedDocument, Model, ObjectId, QueryWithHelpers } from "mongoose"
import type { ACCOUNT_TYPES } from "@models/User"
import type { DateType } from "."

export interface IUser {
	name: string
	email: string
	username: string
	password: string
	accountType: typeof ACCOUNT_TYPES[number]
	startedTests: {
		exam: ObjectId
		createdAt: DateType
	}[]
	createdAt: DateType
	updatedAt?: DateType
}

export interface IUserMethods {
	validatePassword(password: string): string
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
	hashPassword(password: string): string
	generateToken(): Promise<string>
}
