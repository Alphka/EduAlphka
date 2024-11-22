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

export async function login({
	username: usernameOrEmail,
	password,
	keep_logged_in: keepLoggedIn = true
}: UserLoginData){
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const isEmail = usernameOrEmail.includes("@")
	const loginSchema = getLoginSchema(dictionary)
	const validatedFields = loginSchema.safeParse({
		[isEmail ? "email" : "username"]: usernameOrEmail,
		password
	})

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	usernameOrEmail = (validatedFields.data.username || validatedFields.data.email) as string
	password = validatedFields.data.password

	try{
		await authenticateUser(dictionary, {
			usernameOrEmail,
			password,
			keepLoggedIn
		})
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: [dictionary.login.form.errors.failedToAuthenticate] }
	}

	revalidatePath("/")
	revalidatePath(`/${locale}`)
	redirect(`/${locale}`)
}
