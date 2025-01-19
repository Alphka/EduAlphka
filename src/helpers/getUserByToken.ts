import type { HydratedDocument, Types } from "mongoose"
import type { IUser, IUserMethods } from "@models/typings/User"
import type { ISession } from "@models/typings/Session"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import { cookies } from "next/headers"
import connectDatabase from "@lib/connectDatabase"

export type UserByToken = Omit<IUser, "_id"> & { id: string }

function getUserByToken(token: string, hydrated: true): Promise<(HydratedDocument<IUser> & IUserMethods) | null>
function getUserByToken(token: string, hydrated?: false): Promise<UserByToken | null>
function getUserByToken(token: string, hydrated: boolean): Promise<UserByToken | (HydratedDocument<IUser> & IUserMethods) | null>
async function getUserByToken(token: string, hydrated = false){
	const [cookiesStore] = await Promise.all([
		cookies(),
		connectDatabase()
	])

	const session = await Session
		.findOne({ token }, { user: 1 })
		.populate("user")
		.lean<Pick<ISession, "_id"> & { user: IUser | null }>()

	if(!session?.user){
		if(session && !session.user){
			const { user } = await Session
				.findById<{ user: Types.ObjectId }>(session, { _id: 0, user: 1 })
				.orFail()

			console.error(
				"Session user not found, deleting user sessions." +
				`\n\tSession ID: ${session._id}` +
				`\n\tUser ID: ${user}`
			)

			cookiesStore.delete(TOKEN_KEY)

			await Session.deleteMany({
				$or: [
					{ _id: session._id },
					{ user: { _id: user } }
				]
			})
		}

		return null
	}

	if(hydrated){
		return User.hydrate(session.user)
	}

	const { _id, ...rest } = session.user

	return {
		id: _id.toString(),
		...rest
	}
}

export default getUserByToken
