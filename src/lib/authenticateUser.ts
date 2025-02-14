import type { IUser, IUserMethods } from "@models/typings/User"
import type { HydratedDocument } from "mongoose"
import { cookies, headers } from "next/headers"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import connectDatabase from "./connectDatabase"
import normalizeEmail from "normalize-email"
import getToken from "@helpers/getToken"

type LoginProps = {
	usernameOrEmail: string
	password: string
}

type SigninProps = {
	user: HydratedDocument<IUser> & IUserMethods
}

export default async function authenticateUser({
	keepLoggedIn = true,
	...data
}: (LoginProps | SigninProps) & {
	keepLoggedIn: boolean
}){
	const oldToken = await getToken()

	await connectDatabase()

	let user: HydratedDocument<IUser> & IUserMethods

	if("user" in data){
		user = data.user
	}else{
		const { usernameOrEmail, password } = data

		try{
			user = await User
				.findOne({
					$or: [
						{ normalizedEmail: normalizeEmail(usernameOrEmail) },
						{ username: usernameOrEmail }
					]
				}, { password: 1 })
				.collation({ locale: "en", strength: 2 })
				.orFail()

			if(!user.validatePassword(password)) throw "Senha inválida"
		}catch{
			throw "Credenciais inválidas"
		}
	}

	const [headersStore, cookiesStore] = await Promise.all([
		headers(),
		cookies()
	])

	const token = await User.generateToken()
	const tokenExpirationDate = new Date

	tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1)

	await Promise.all([
		Session.create({
			token,
			user: user.id,
			userAgent: headersStore.get("user-agent")?.trim().substring(0, 255) || "",
			expiresAt: tokenExpirationDate
		}).then(() => cookiesStore.set({
			name: TOKEN_KEY,
			value: token,
			path: "/",
			expires: keepLoggedIn ? tokenExpirationDate : undefined,
			sameSite: "lax"
		})),
		oldToken && Session.deleteOne({ token: oldToken })
	])
}
