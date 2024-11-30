import { cookies, headers } from "next/headers"
import { TOKEN_KEY } from "@constants/index"
import validateToken from "./validateToken"

export default async function getToken(){
	return validateToken((await headers()).get("Authorization"))
		|| validateToken((await cookies()).get(TOKEN_KEY)?.value)
		|| null
}
