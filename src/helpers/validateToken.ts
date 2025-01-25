export const tokenPattern = "^[a-fA-F0-9]{96}$"

const tokenRegex = new RegExp(`^${tokenPattern}\$`)
const bearerTokenRegex = new RegExp(`^Bearer ${tokenPattern}\$`)

export default function validateToken(token: string | null | undefined){
	if(!token) return false

	let isBearer = false

	if(bearerTokenRegex.test(token)) isBearer = true
	else if(!tokenRegex.test(token)) return false

	return (isBearer ? token.substring(7) : token)
}
