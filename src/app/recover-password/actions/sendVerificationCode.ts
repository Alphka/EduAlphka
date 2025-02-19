"use server"

import { GenericFormValidation, PasswordRecoveryFormValidation } from "@constants/forms"
import { EMAIL_VERIFICATION_TIMEOUT } from "@constants"
import { User, VerificationCode } from "@models"
import sendEmail, { type GmailError } from "@lib/sendEmail"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"

const sentEmailCache = new Set<string>

export default async function sendVerificationCode(email: string){
	await connectDatabase()

	if(
		typeof email !== "string" ||
		!(email = email.trim()) ||
		!new RegExp(GenericFormValidation.validEmailPattern).test(email)
	){
		return { errors: ["E-mail inválido"] }
	}

	const user = await User.findOne({
		normalizedEmail: normalizeEmail(email)
	})

	if(sentEmailCache.has(email)){
		return { errors: ["Aguarde um momento para enviar outro e-mail de verificação"] }
	}

	sentEmailCache.add(email)

	setTimeout(() => sentEmailCache.delete(email), EMAIL_VERIFICATION_TIMEOUT)

	if(user){
		try{
			const expirationDate = new Date

			expirationDate.setMinutes(expirationDate.getMinutes() + 30)

			const verificationCode = new VerificationCode({
				code: Math.floor(Math.random() * 10 ** PasswordRecoveryFormValidation.codeLength),
				user: user,
				expiresAt: expirationDate
			})

			await sendEmail({
				to: email,
				subject: "Recuperação de senha",
				text: `Olá, ${user.name}.\n\nO código de verificação para recuperação de senha é ${verificationCode.code}`,
				html: `Olá, ${user.name}.<br><br>O código de verificação para recuperação de senha é <b>${verificationCode.code}</b>`
			})

			await verificationCode.save()
		}catch(error){
			const errorMessage = typeof error === "object" && error && "responseCode" in error
				? `[${(error as GmailError).code}] ${(error as GmailError).response?.split("\n").map(line => "\t" + line).join("\n")}`
				: error instanceof Error
					? error.message
					: error

			console.error("Error sending verification code email:\n" + errorMessage)

			return { errors: ["Falha ao enviar o e-mail de verificação"] }
		}
	}
}
