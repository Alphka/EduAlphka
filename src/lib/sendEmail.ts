import type Mail from "nodemailer/lib/mailer"
import { createTransport } from "nodemailer"

const { EMAIL, EMAIL_PASSWORD } = process.env

if(!EMAIL){
	throw new Error("Missing environment variable EMAIL")
}

if(!EMAIL_PASSWORD){
	throw new Error("Missing environment variable EMAIL_PASSWORD")
}

export interface GmailError extends Error {
	code?: string
	command?: string
	response?: string
	responseCode?: number
}

export default async function sendEmail(options: Omit<Mail.Options, "from">){
	const transporter = createTransport({
		service: "gmail",
		secure: true,
		host: "smtp.gmail.com",
		port: 465,
		auth: {
			user: EMAIL,
			pass: EMAIL_PASSWORD
		}
	})

	await transporter.sendMail({
		from: EMAIL,
		...options
	})

	transporter.close()
}
