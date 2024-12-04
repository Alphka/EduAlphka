import getUserByToken from "./getUserByToken"
import getToken from "./getToken"

export default async function getSessionUser(){
	const token = await getToken()
	const user = token && await getUserByToken(token)

	return user || null
}
