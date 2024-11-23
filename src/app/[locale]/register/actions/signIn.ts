"use server"

import { revalidatePath } from "next/cache"
import { getDictionary } from "@dictionaries"
import { redirect } from "next/navigation"
import authenticateUser from "@lib/authenticateUser"
import getSignInSchema from "../schemas/signIn"
import registerUser from "@lib/registerUser"
import getLocale from "@helpers/getLocale"

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
	const locale = await getLocale()
	const dictionary = await getDictionary(locale)

	const signInSchema = getSignInSchema(dictionary)
	const validatedFields = signInSchema.safeParse({ name, username, email, password, account_type })

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	try{
		const user = await registerUser(dictionary, {
			name: validatedFields.data.name,
			email: validatedFields.data.email,
			username: validatedFields.data.username,
			password: validatedFields.data.password,
			accountType: validatedFields.data.account_type
		})

		await authenticateUser(dictionary, {
			user,
			keepLoggedIn: keep_logged_in
		})
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: [dictionary.register.form.errors.failedToRegister] }
	}

	revalidatePath("/")
	revalidatePath(`/${locale}`)
	redirect(`/${locale}`)
}
