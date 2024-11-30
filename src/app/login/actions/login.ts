"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import authenticateUser from "@lib/authenticateUser"
import loginSchema from "../schemas/login"
import routes from "@app/routes"

export interface UserLoginData {
	username: string
	password: string
	keep_logged_in?: boolean
}

export async function login({
	username: usernameOrEmail,
	password,
	keep_logged_in: keepLoggedIn = true
}: UserLoginData){
	const isEmail = usernameOrEmail.includes("@")

	const validatedFields = loginSchema.safeParse({
		[isEmail ? "email" : "username"]: usernameOrEmail,
		password
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

	revalidatePath("/")
	revalidatePath(routes.homepage.pathname)
	redirect(routes.homepage.pathname)
}
