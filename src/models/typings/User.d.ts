import type { ACCOUNT_TYPES } from "@models/User"
import type { Model, Types } from "mongoose"
import type { DateType } from "."

export interface IUser {
	name: string
	email: string
	username: string
	password: string
	accountType: typeof ACCOUNT_TYPES[number]
	startedTests: {
		exam: Types.ObjectId
		startedAt: DateType
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
