import { TOKEN_KEY, TOKEN_LENGTH } from "@constants/index"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Session } from "@models"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function GET(){
	const [cookiesStore] = await Promise.all([
		cookies()
	])

	const token = cookiesStore.get(TOKEN_KEY)?.value

	if(token && token.length === TOKEN_LENGTH){
		await connectDatabase()
		await Session.deleteOne({ token })
	}

	const responseHeaders = new Headers

	responseHeaders.set("Location", routes.login.pathname)
	responseHeaders.set("Set-Cookie", `${TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)

	return new NextResponse(null, {
		status: 302,
		statusText: "Found",
		headers: responseHeaders
	})
}
