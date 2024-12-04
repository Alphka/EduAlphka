import type { RootLayoutProps } from "../layout"
import { pick } from "lodash"
import LayoutShell from "./components/LayoutShell"
import { redirect } from "next/navigation"
import routes from "@app/routes"
import getToken from "@helpers/getToken"
import connectDatabase from "@lib/connectDatabase"
import { Session, User } from "@models"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ children }: LayoutProps){
	// const user = await verifyAuthorization()
	const token = await getToken()

	if(!token) redirect(routes.login.pathname)

	await connectDatabase()

	const session = await Session.findOne({ token }).select("user")
	const user = session && await User.findById(session.user).lean()

	if(!user) redirect(routes.login.pathname)

	return (
		<LayoutShell
			user={pick(user, ["name"] as const)}
		>
			{children}
		</LayoutShell>
	)
}
