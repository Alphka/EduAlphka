"use server"

import { GenericFormValidation, PasswordRecoveryFormValidation } from "@constants/forms"
import { EMAIL_VERIFICATION_TIMEOUT } from "@constants"
import { User, VerificationCode } from "@models"
import { createTransport } from "nodemailer"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"

const { RECOVERY_PASSWORD_EMAIL, RECOVERY_PASSWORD_PASSWORD } = process.env

if(!RECOVERY_PASSWORD_EMAIL){
	throw new Error("Missing environment variable RECOVERY_PASSWORD_EMAIL")
}

if(!RECOVERY_PASSWORD_PASSWORD){
	throw new Error("Missing environment variable RECOVERY_PASSWORD_PASSWORD")
}

interface GmailError {
	code: string
	response: string
	responseCode: number
	command: string
}

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

	const user = await User.findOne({ normalizedEmail: normalizeEmail(email) })

	const transporter = createTransport({
		service: "gmail",
		secure: true,
		host: "smtp.gmail.com",
		port: 465,
		auth: {
			user: RECOVERY_PASSWORD_EMAIL,
			pass: RECOVERY_PASSWORD_PASSWORD
		}
	})

	if(sentEmailCache.has(email)){
		return { errors: ["Aguarde um momento para enviar outro e-mail de verificação"] }
	}

	sentEmailCache.add(email)

	setTimeout(() => {
		sentEmailCache.delete(email)
	}, EMAIL_VERIFICATION_TIMEOUT)

	if(user){
		try{
			const expirationDate = new Date

			expirationDate.setMinutes(expirationDate.getMinutes() + 30)

			const verificationCode = new VerificationCode({
				code: Math.floor(Math.random() * 10 ** PasswordRecoveryFormValidation.codeLength),
				user: user._id,
				expiresAt: expirationDate
			})

			await transporter.sendMail({
				from: RECOVERY_PASSWORD_EMAIL,
				to: email,
				subject: "Recuperação de senha",
				text: `O código de verificação para recuperação de senha é ${verificationCode.code}`
			})

			await verificationCode.save()
		}catch(error){
			let errorMessage = typeof error === "object" && error && "responseCode" in error
				? `[${(error as GmailError).code}] ${(error as GmailError).response
					.split("\n")
					.map(line => "\t" + line)
					.join("\n")}`
				: error instanceof Error
					? error.message
					: error

			console.error("Error sending verification code email:\n" + errorMessage)

			return { errors: ["Falha ao enviar o e-mail de verificação"] }
		}
	}
}
