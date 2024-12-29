import { TOKEN_KEY, TOKEN_LENGTH } from "@constants/index"
import { NextResponse } from "next/server"
import { Session } from "@models"
import connectDatabase from "@lib/connectDatabase"
import getToken from "@helpers/getToken"
import routes from "@app/routes"

export async function GET(){
	const token = await getToken()

	if(token && token.length === TOKEN_LENGTH){
		await connectDatabase()
		await Session.deleteOne({ token })
	}

	return new NextResponse(null, {
		status: 302,
		statusText: "Found",
		headers: {
			Location: routes.login.pathname,
			"Set-Cookie": `${TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
		}
	})
}
