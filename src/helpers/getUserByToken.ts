import { Session, User } from "@models"
import connectDatabase from "@lib/connectDatabase"

export default async function getUserByToken(token: string){
	await connectDatabase()

	const session = await Session.findOne({ token }).select("user")
	const user = session && await User.findOne({ _id: session.user })

	return user || null
}
