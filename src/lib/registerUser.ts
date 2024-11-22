import type { AccountType } from "@typings/api"
import type { Dictionary } from "@app/[locale]/dictionaries"
import { User } from "@models"
import connectDatabase from "./connectDatabase"
import "server-only"

export default async function registerUser(dictionary: Dictionary, {
	name,
	email,
	username,
	password,
	accountType
}: {
	name: string
	email: string
	username: string
	password: string
	accountType: AccountType
}){
	await connectDatabase()

	let user = await User.findOne({
		$or: [
			{ email },
			{ username }
		]
	})

	if(user){
		if(user.username === username) throw dictionary.register.form.errors.emailAlreadyInUse
		if(user.email === email) throw dictionary.register.form.errors.emailAlreadyInUse
		throw dictionary.register.form.errors.credentialsAlreadyInUse
	}

	user = await User.create({
		name,
		email,
		username,
		password: User.hashPassword(password),
		accountType,
		startedTests: []
	})

	return user
}
