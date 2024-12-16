import type { IUser } from "@models/typings/User"
import { Session } from "@models"
import connectDatabase from "@lib/connectDatabase"

export default async function getUserByToken(token: string){
	await connectDatabase()

	const session = await Session
		.findOne({ token }, { user: 1 })
		.populate<{ user: IUser }>("user")
		.lean()

	if(!session?.user){
		if(session && !session.user){
			const { id, user } = (await Session.findById(session._id, { user: 1 }))!

			console.error(
				"Session user not found, deleting user sessions." +
				`\n\tSession ID: ${id}` +
				`\n\tUser ID: ${user}`
			)

			await Session.deleteMany({ $or: [{ _id: id }, { user }] })
		}

		return null
	}

	const { _id, ...rest } = session.user

	return {
		id: _id.toString(),
		...rest
	}
}
