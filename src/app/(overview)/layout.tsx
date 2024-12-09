import type { RootLayoutProps } from "../layout"
import { redirect } from "next/navigation"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import LayoutShell from "./components/LayoutShell"
import routes from "@app/routes"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ children }: LayoutProps){
	const user = await verifyAuthorization()

	if(!user) redirect(routes.login.pathname)

	return (
		<LayoutShell
			user={pick(user, ["name"] as const)}
		>
			{children}
		</LayoutShell>
	)
}
