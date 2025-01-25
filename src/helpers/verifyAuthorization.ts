import type { AccountType } from "@typings/api"
import { redirect, RedirectType } from "next/navigation"
import { TOKEN_KEY } from "@constants/index"
import { cookies } from "next/headers"
import { Session } from "@models"
import { omit } from "lodash"
import getSessionUserData from "./getSessionUserData"
import getRequestURL from "./getRequestURL"
import routes from "@app/routes"

interface AuthorizationOptions {
	accountType?: AccountType
}

export default async function verifyAuthorization(options: AuthorizationOptions = {}){
	const cookiesStore = await cookies()
	const user = await getSessionUserData()

	const unauthorize = () => {
		cookiesStore.delete(TOKEN_KEY)
		return redirectToLogin()
	}

	if(!user){
		return unauthorize()
	}

	const { session } = user

	if(Date.now() > session.expiresAt.getTime()){
		await Session.hydrate(session).deleteOne()
		return unauthorize()
	}

	if(options.accountType){
		if(user.accountType !== options.accountType){
			redirect(routes.accessDenied.pathname, RedirectType.replace)
		}
	}

	return omit(user, "session")
}

async function redirectToLogin(): Promise<never> {
	let url: URL

	try{
		url = new URL((await getRequestURL())!)
	}catch(error){
		console.error("Failed to get page URL:", error)
		redirect(routes.login.pathname)
	}

	redirect(url.pathname !== "/" && url.pathname !== "/login"
		? `${routes.login.pathname}?redirect=${encodeURIComponent(url.pathname)}`
		: routes.login.pathname
	)
}
