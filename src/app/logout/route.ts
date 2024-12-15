import { TOKEN_KEY, TOKEN_LENGTH } from "@constants/index"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { Session } from "@models"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function GET(){
	const [cookiesStore] = await Promise.all([
		cookies(),
		await connectDatabase()
	])

	const token = cookiesStore.get(TOKEN_KEY)?.value

	if(token && token.length >= TOKEN_LENGTH){
		await Session.deleteOne({ token })
		cookiesStore.delete(TOKEN_KEY)
	}

	return NextResponse.redirect(routes.login.pathname)
}
