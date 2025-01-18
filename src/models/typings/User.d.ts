import type { ACCOUNT_TYPES } from "@models/User"
import type { Model, Types } from "mongoose"

export interface IUser {
	_id: Types.ObjectId
	name: string
	email: string
	normalizedEmail: string
	username: string
	password: string
	accountType: typeof ACCOUNT_TYPES[number]
	createdAt: Date
	updatedAt?: Date
}

export interface IUserMethods {
	validatePassword(password: string): string
}

export interface UserModel extends Model<IUser, {}, IUserMethods> {
	hashPassword(password: string): string
	generateToken(): Promise<string>
}
