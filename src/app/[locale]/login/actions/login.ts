"use server"

import { revalidatePath } from "next/cache"
import { getDictionary } from "@app/[locale]/dictionaries"
import { redirect } from "next/navigation"
import authenticateUser from "@lib/authenticateUser"
import getLoginSchema from "../schemas/login"
import getLocale from "@helpers/getLocale"

export interface UserLoginData {
	username: string
	password: string
	keep_logged_in?: boolean
}

export async function login(usernameOrEmail: string, password: string, keepLoggedIn = true){
	const locale = await getLocale()
	const { login: { form: dictionary } } = await getDictionary(locale)

	const loginSchema = getLoginSchema(dictionary)
	const validatedFields = loginSchema.safeParse({ username: usernameOrEmail, password })

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	try{
		await authenticateUser(usernameOrEmail, password, keepLoggedIn)

		revalidatePath("/")
		redirect("/")
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: [dictionary.errors.failedToAuthenticate] }
	}
}
