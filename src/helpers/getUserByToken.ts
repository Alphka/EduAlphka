import type { ISession } from "@models/typings/Session"
import type { IUser } from "@models/typings/User"
import type { Types } from "mongoose"
import { TOKEN_KEY } from "@constants"
import { cookies } from "next/headers"
import { Session } from "@models"
import connectDatabase from "@lib/connectDatabase"

export default async function getUserByToken(token: string){
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

	const { _id, ...rest } = session.user

	return {
		id: _id.toString(),
		...rest
	}
}
