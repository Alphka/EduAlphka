import type { HydratedDocument } from "mongoose"
import type { Dictionary } from "@dictionaries"
import type { IUser } from "@models/typings/User"
import { cookies, headers } from "next/headers"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import connectDatabase from "./connectDatabase"

export default async function authenticateUser(dictionary: Dictionary, {
	keepLoggedIn = true,
	...data
}: {
	usernameOrEmail: string
	password: string
	keepLoggedIn: boolean
} | {
	user: HydratedDocument<IUser>
	keepLoggedIn: boolean
}){
	await connectDatabase()

	let user: HydratedDocument<IUser>

	if("user" in data){
		user = data.user
	}else{
		const { usernameOrEmail, password } = data

		const _user = await User.findOne({
			[usernameOrEmail.includes("@") ? "email" : "username"]: usernameOrEmail
		})

		if(!_user || !_user.validatePassword(password)) throw dictionary.login.form.errors.invalidCredentials

		user = _user
	}

	const headersStore = await headers()
	const cookiesStore = await cookies()
	const token = await User.generateToken()
	const tokenExpirationDate = new Date

	tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1)

	await Session.create({
		token,
		userId: user.id,
		userAgent: headersStore.get("user-agent") || "",
		expiresAt: tokenExpirationDate
	})

	cookiesStore.set({
		name: TOKEN_KEY,
		value: token,
		path: "/",
		expires: keepLoggedIn ? tokenExpirationDate : undefined,
		sameSite: "lax"
	})
}
