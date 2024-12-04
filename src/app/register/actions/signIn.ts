"use server"

import { redirect } from "next/navigation"
import authenticateUser from "@lib/authenticateUser"
import signInSchema from "../schemas/signIn"
import registerUser from "@lib/registerUser"
import routes from "@app/routes"

export interface UserSignInData {
	name: string
	email: string
	username: string
	password: string
	account_type: string
	keep_logged_in?: boolean
}

export async function signIn({
	name,
	email,
	username,
	password,
	account_type,
	keep_logged_in = false
}: UserSignInData){
	const validatedFields = signInSchema.safeParse({ name, username, email, password, account_type })

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	try{
		const user = await registerUser({
			name: validatedFields.data.name,
			email: validatedFields.data.email,
			username: validatedFields.data.username,
			password: validatedFields.data.password,
			accountType: validatedFields.data.account_type
		})

		await authenticateUser({
			user,
			keepLoggedIn: keep_logged_in
		})
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: ["Falha ao registrar o usuário"] }
	}

	redirect(routes.homepage.pathname)
}
