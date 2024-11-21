import { cookies, headers } from "next/headers"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@app/constants"
import connectDatabase from "./connectDatabase"
import "server-only"

export default async function authenticateUser(usernameOrEmail: string, password: string, keepLoggedIn = true){
	await connectDatabase()

	const user = await User.findOne({
		[usernameOrEmail.includes("@") ? "email" : "username"]: usernameOrEmail
	})

	if(!user || !user.validatePassword(password)) throw "Credenciais inválidas"

	const headersStore = await headers()
	const cookiesStore = await cookies()
	const token = await User.generateToken()
	const tokenExpirationDate = new Date

	tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1)

	new Session({
		token,
		userAgent: headersStore.get("user-agent") || "",
		expiresAt: tokenExpirationDate
	})

	cookiesStore.set({
		name: TOKEN_KEY,
		value: token,
		path: "/",
		expires: keepLoggedIn ? tokenExpirationDate : undefined,
		sameSite: "lax",
	})
}
