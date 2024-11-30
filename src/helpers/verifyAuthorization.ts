import type { AccountType } from "@typings/api"
import { Session, User } from "@models"
import { redirect } from "next/navigation"
import connectDatabase from "@lib/connectDatabase"
import getToken from "./getToken"
import routes from "@app/routes"

interface AuthorizationOptions {
	accountType?: AccountType
}

export default async function verifyAuthorization(options: AuthorizationOptions = {}){
	const token = await getToken()

	if(!token) redirect(routes.login.pathname)

	await connectDatabase()

	const session = await Session.findOne({ token }).select("userId")
	const user = session && await User.findOne({ _id: session.userId })

	if(!user) redirect(routes.login.pathname)

	if(options.accountType){
		if(user.accountType !== options.accountType) redirect(routes.accessDenied.pathname)
	}

	return user
}
