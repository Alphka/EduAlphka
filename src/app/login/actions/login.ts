"use server"

import { revalidatePath } from "next/cache"
import { loginSchema } from "../constants"
import { redirect } from "next/navigation"

export default async function authenticateUser(_prevState: any, data: FormData){
	const validatedFields = loginSchema.safeParse(Object.fromEntries(data.entries()))

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.formErrors
		}
	}

	revalidatePath("/")
	redirect("/")
}
