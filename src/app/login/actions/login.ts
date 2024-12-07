"use server"

import { redirect } from "next/navigation"
import authenticateUser from "@lib/authenticateUser"
import loginSchema from "@schemas/login"
import routes from "@app/routes"

export interface UserLoginData {
	username: string
	password: string
	keep_logged_in: boolean
}

export async function loginAction({
	username: usernameOrEmail,
	password,
	keep_logged_in: keepLoggedIn
}: UserLoginData){
	const isEmail = usernameOrEmail.includes("@")

	const validatedFields = loginSchema.safeParse({
		[isEmail ? "email" : "username"]: usernameOrEmail,
		password,
		keep_logged_in: keepLoggedIn
	})

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	usernameOrEmail = ("username" in validatedFields.data && validatedFields.data.username || "email" in validatedFields.data && validatedFields.data.email) as string
	password = validatedFields.data.password

	try{
		await authenticateUser({
			usernameOrEmail,
			password,
			keepLoggedIn
		})
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: ["Falha ao autenticar o usuário"] }
	}

	redirect(routes.homepage.pathname)
}
