import type { HydratedDocument, Model, ObjectId, QueryWithHelpers } from "mongoose"
import type { accountTypes } from "@models/User"
import type { DateType } from "."

export interface IUser {
	name: string
	email: string
	username: string
	password: string
	accountType: typeof accountTypes[number]
	startedTests: {
		exam: ObjectId
		createdAt: DateType
	}[]
	createdAt: DateType
	updatedAt: DateType
}

export interface IUserMethods {
	hashPassword(password: string): string
	validatePassword(password: string): string
}

export interface IUserQueryHelpers {
	byToken: (token: string) => QueryWithHelpers<
		HydratedDocument<IUser>[],
		HydratedDocument<IUser>,
		IUserQueryHelpers
	>
}

export interface UserModel extends Model<IUser, IUserQueryHelpers, IUserMethods> {
	generateToken(): Promise<string>
}
