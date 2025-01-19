import type { IUser, IUserMethods } from "@models/typings/User"
import type { HydratedDocument } from "mongoose"
import getUserByToken, { type UserByToken } from "./getUserByToken"
import getToken from "./getToken"

function getSessionUserData(hydrated: true): Promise<(HydratedDocument<IUser> & IUserMethods) | null>
function getSessionUserData(hydrated?: false): Promise<UserByToken>
function getSessionUserData(hydrated: boolean): Promise<UserByToken | (HydratedDocument<IUser> & IUserMethods) | null>
async function getSessionUserData(hydrated = false){
	const token = await getToken()
	const user = token && await getUserByToken(token, hydrated)

	return user || null
}

export default getSessionUserData
