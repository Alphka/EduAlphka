import { Session, User } from "@models"
import connectDatabase from "@lib/connectDatabase"

export default async function getUserByToken(token: string){
	await connectDatabase()

	const session = await Session.findOne({ token }).select("user").lean()
	const user = session && await User.findById(session.user).lean()

	if(!user) return null

	const { _id, ...rest } = user

	return {
		id: _id.toString(),
		...rest
	}
}
