import type { HydratedDocument } from "mongoose"
import type { IUser } from "@models/typings/User"
import { cookies, headers } from "next/headers"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import connectDatabase from "./connectDatabase"

export default async function authenticateUser({
	keepLoggedIn = true,
	...data
}: { keepLoggedIn: boolean } & ({
	usernameOrEmail: string
	password: string
} | { user: HydratedDocument<IUser> })){
	await connectDatabase()

	let user: HydratedDocument<IUser>

	if("user" in data){
		user = data.user
	}else{
		const { usernameOrEmail, password } = data

		const _user = await User.findOne({
			$or: [
				{ email: usernameOrEmail },
				{ username: usernameOrEmail }
			]
		})

		if(!_user || !_user.validatePassword(password)) throw "Credenciais inválidas"

		user = _user
	}

	const headersStore = await headers()
	const cookiesStore = await cookies()
	const token = await User.generateToken()
	const tokenExpirationDate = new Date

	tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1)

	await Session.create({
		token,
		user: user.id,
		userAgent: headersStore.get("user-agent")?.trim().substring(0, 255) || "",
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
