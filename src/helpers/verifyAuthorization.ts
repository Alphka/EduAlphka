import type { AccountType } from "@typings/api"
import { redirect } from "next/navigation"
import getUserByToken from "./getUserByToken"
import getToken from "./getToken"
import routes from "@app/routes"

interface AuthorizationOptions {
	accountType?: AccountType
}

export default async function verifyAuthorization(options: AuthorizationOptions = {}){
	const token = await getToken()

	if(!token) redirect(routes.login.pathname)

	const user = await getUserByToken(token)

	if(!user) redirect(routes.login.pathname)

	if(options.accountType){
		if(user.accountType !== options.accountType) redirect(routes.accessDenied.pathname)
	}

	return user
}
