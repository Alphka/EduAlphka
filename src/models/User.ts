import type { IUser, IUserMethods, UserModel } from "./typings/User"
import { createHmac, randomBytes } from "crypto"
import { GenericFormValidation } from "@constants/forms"
import { Schema, model, models } from "mongoose"

const { HASH_SALT } = process.env

if(!HASH_SALT) throw "Please define the HASH_SALT environment variable inside .env.local"

export const ACCOUNT_TYPES = ["professor", "candidate"] as const

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
	name: {
		type: String,
		required: true,
		minlength: GenericFormValidation.nameMinLength,
		maxlength: GenericFormValidation.nameMaxLength
	},
	email: {
		type: String,
		required: true,
		minlength: GenericFormValidation.emailMinLength,
		maxlength: GenericFormValidation.emailMaxLength,
		unique: true
	},
	username: {
		type: String,
		required: true,
		minlength: GenericFormValidation.usernameMinLength,
		maxlength: GenericFormValidation.usernameMaxLength,
		index: {
			unique: true,
			collation: {
				locale: "en",
				strength: 2
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: GenericFormValidation.passwordMinLength,
		maxlength: GenericFormValidation.passwordMaxLength
	},
	accountType: {
		type: String,
		enum: ACCOUNT_TYPES,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true
	},
	updatedAt: Date
})

userSchema.static("generateToken", async function generateToken(){
	const { default: Session } = await import("./Session")

	let token: string

	do{
		token = await new Promise<string>((resolve, reject) => randomBytes(48, (error, buffer) => {
			if(error) return reject(error)
			resolve(buffer.toString("hex"))
		}))
	}while(await Session.exists({ token }))

	return token
})

userSchema.static("hashPassword", function hashPassword(password: string){
	const hash = createHmac("sha512", HASH_SALT).update(password)
	return hash.digest("hex")
})

userSchema.method("validatePassword", function validatePassword(password: string){
	return this.password === User.hashPassword(password)
})

const User = models?.User as UserModel || model<IUser, UserModel>("User", userSchema)

export default User
