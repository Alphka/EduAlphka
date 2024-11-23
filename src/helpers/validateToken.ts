export const tokenPattern = "^[a-fA-F0-9]{96}$"

const tokenRegex = new RegExp(`^${tokenPattern}\$`)
const bearerTokenRegex = new RegExp(`^Bearer ${tokenPattern}\$`)

export default function validateToken(text: string | null | undefined){
	if(!text) return false

	let isBearer = false

	if(bearerTokenRegex.test(text)) isBearer = true
	else if(!tokenRegex.test(text)) return false

	return (isBearer ? text.substring(7) : text)
}
