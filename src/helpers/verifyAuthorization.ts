import type { AccountType } from "@typings/api"
import type { Locales } from "@src/i18n"
import { Session, User } from "@models"
import { redirect } from "next/navigation"
import getRouteWithLocale from "./getRouteWithLocale"
import connectDatabase from "@lib/connectDatabase"
import getLocale from "./getLocale"
import getToken from "./getToken"
import routes from "@app/routes"

interface AuthorizationOptions {
	accountType?: AccountType
	locale?: Locales
}

export default async function verifyAuthorization(options: AuthorizationOptions = {}){
	options.locale ??= await getLocale() as Locales

	const token = await getToken()

	if(!token) redirect(getRouteWithLocale(routes.login.pathname, options.locale))

	await connectDatabase()

	const session = await Session.findOne({ token }).select("userId")
	const user = session && await User.findOne({ _id: session.userId })

	if(!user) redirect(getRouteWithLocale(routes.login.pathname, options.locale))

	if(options.accountType){
		if(user.accountType !== options.accountType) redirect(getRouteWithLocale(routes.accessDenied.pathname, options.locale))
	}

	return user
}
