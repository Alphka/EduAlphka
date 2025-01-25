import getUserByToken, { type UserByTokenHydrated, type UserByTokenLean } from "./getUserByToken"
import getToken from "./getToken"

function getSessionUserData(hydrated: true): Promise<UserByTokenHydrated | null>
function getSessionUserData(hydrated?: false): Promise<UserByTokenLean | null>
function getSessionUserData(hydrated: boolean): Promise<UserByTokenLean | UserByTokenHydrated | null>
async function getSessionUserData(hydrated = false){
	const token = await getToken()
	const user = token && await getUserByToken(token, hydrated)

	return user || null
}

export default getSessionUserData
