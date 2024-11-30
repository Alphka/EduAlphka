import type { AccountType } from "@typings/api"
import { User } from "@models"
import connectDatabase from "./connectDatabase"

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
			{ email },
			{ username }
		]
	})

	if(user){
		if(user.username === username) throw "Esse nome de usuário já está em uso"
		if(user.email === email) throw "Esse e-mail já está em uso"
		throw "Essas credenciais já estão em uso"
	}

	return await User.create({
		name,
		email,
		username,
		password: User.hashPassword(password),
		accountType,
		startedTests: []
	})
}
