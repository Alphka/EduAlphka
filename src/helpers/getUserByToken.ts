import type { HydratedDocument, Types } from "mongoose"
import type { IUser, IUserMethods } from "@models/typings/User"
import type { ISession } from "@models/typings/Session"
import { Session, User } from "@models"
import { TOKEN_KEY } from "@constants"
import { cookies } from "next/headers"
import { omit } from "lodash"
import connectDatabase from "@lib/connectDatabase"

export interface UserByTokenLean extends Omit<IUser, "_id"> {
	id: string
	session: Omit<ISession, "_id" | "user"> & {
		id: string
	}
}

export interface UserByTokenHydrated extends HydratedDocument<IUser>, IUserMethods {
	session: HydratedDocument<Omit<ISession, "user">>
}

function getUserByToken(token: string, hydrated: true): Promise<UserByTokenHydrated | null>
function getUserByToken(token: string, hydrated?: false): Promise<UserByTokenLean | null>
function getUserByToken(token: string, hydrated: boolean): Promise<UserByTokenLean | UserByTokenHydrated | null>
async function getUserByToken(token: string, hydrated = false){
	await connectDatabase()

	const session = await Session
		.findOne({ token })
		.populate("user", { __v: 0 })
		.lean<Omit<ISession, "user"> & { user: IUser | null }>()

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

			await Promise.all([
				cookies().then(cookiesStore => cookiesStore.delete(TOKEN_KEY)),
				Session.deleteMany({
					$or: [
						{ _id: session._id },
						{ user: user }
					]
				})
			])
		}

		return null
	}

	if(hydrated){
		return User.hydrate(Object.assign(session.user, {
			session: Session.hydrate(omit(session, "user"))
		}))
	}

	return {
		id: session.user._id.toString(),
		...omit(session.user, "_id"),
		session: {
			id: session._id.toString(),
			...omit(session, ["_id", "user"] as const)
		}
	}
}

export default getUserByToken
