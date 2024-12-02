import getToken from "./getToken"
import getUserByToken from "./getUserByToken"

export default async function getSessionUser(){
	const token = await getToken()
	const user = token && await getUserByToken(token)

	return user || null
}
