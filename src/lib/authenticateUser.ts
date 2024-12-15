import { cookies, headers } from "next/headers"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import connectDatabase from "./connectDatabase"

type LoginProps = {
	usernameOrEmail: string
	password: string
}

type SigninProps = {
	user: InstanceType<typeof User>
}

export default async function authenticateUser({
	keepLoggedIn = true,
	...data
}: (LoginProps | SigninProps) & {
	keepLoggedIn: boolean
}){
	await connectDatabase()

	let user: InstanceType<typeof User>

	if("user" in data){
		user = data.user
	}else{
		const { usernameOrEmail, password } = data

		try{
			user = await User
				.findOne({
					$or: [
						{ email: usernameOrEmail },
						{ username: usernameOrEmail }
					]
				}, { password: 1 })
				.collation({ locale: "en", strength: 2 })
				.orFail(new Error("Usuário não existe"))

			if(!user.validatePassword(password)) throw "Senha inválida"
		}catch{
			throw "Credenciais inválidas"
		}
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
