import type { NextRequest } from "next/server"
import { cookies, headers } from "next/headers"
import { TOKEN_KEY } from "@constants/index"
import validateToken from "./validateToken"

export function getMiddlewareToken(request: NextRequest){
	return validateToken(request.headers.get("Authorization"))
		|| validateToken(request.cookies.get(TOKEN_KEY)?.value)
		|| null
}

export default async function getToken(){
	return validateToken((await headers()).get("Authorization"))
		|| validateToken((await cookies()).get(TOKEN_KEY)?.value)
		|| null
}
