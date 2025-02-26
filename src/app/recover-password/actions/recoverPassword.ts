"use server"

import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { User, VerificationCode } from "@models"
import { redirect } from "next/navigation"
import passwordRecoverySchema from "@schemas/passwordRecovery"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"
import routes from "@app/routes"

export interface PasswordRecoveryData {
	newPassword: string
	email: string
	code: string
}

export default async function recoverPassword({
	newPassword: password,
	email,
	code
}: PasswordRecoveryData){
	const validatedFields = passwordRecoverySchema.safeParse({
		password,
		email,
		code
	})

	if(!validatedFields.success){
		return {
			errors: validatedFields.error.errors.map(error => error.message)
		}
	}

	try{
		await connectDatabase()

		const verificationCode = await VerificationCode
			.findOne({
				code: validatedFields.data.code
			}, { user: 1 })
			.populate<{
				user: HydratedDocument<Pick<IUser, "_id" | "password" | "normalizedEmail">>
			}>("user", {
				password: 1,
				normalizedEmail: 1
			})

		const user = verificationCode?.user

		if(!user || user.normalizedEmail !== normalizeEmail(validatedFields.data.email)){
			return { errors: ["Código de verificação não encontrado"] }
		}

		user.password = User.hashPassword(validatedFields.data.password)

		await Promise.all([
			user.save(),
			verificationCode.deleteOne().catch(error => {
				console.error("Failed to delete verification code:", error)
			})
		])
	}catch(error){
		if(typeof error === "string"){
			return { errors: [error] }
		}

		console.error(error)

		return { errors: ["Falha no processo de recuperação de senha"] }
	}

	redirect(routes.login.pathname)
}
