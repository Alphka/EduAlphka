import getUserByToken from "./getUserByToken"
import getToken from "./getToken"

export default async function getSessionUserData(){
	const token = await getToken()
	const user = token && await getUserByToken(token)

	return user || null
}
