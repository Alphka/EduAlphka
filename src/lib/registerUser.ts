import type { AccountType } from "@typings/api"
import { User } from "@models"
import connectDatabase from "./connectDatabase"
import normalizeEmail from "normalize-email"

export default async function registerUser({
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

	const user = await User.findOne({
		$or: [
			{ normalizedEmail: normalizeEmail(email) },
			{ username }
		]
	})

	if(user){
		throw "Esse e-mail ou nome de usuário já está em uso"
	}

	return await User.create({
		name,
		email,
		normalizedEmail: normalizeEmail(email),
		username,
		password: User.hashPassword(password),
		accountType,
		startedTests: []
	})
}
