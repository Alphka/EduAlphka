import type { RootLayoutProps } from "../layout"
import type { IUser } from "@models/typings/User"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import LayoutShell from "./components/LayoutShell"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ children }: LayoutProps){
	const user = await verifyAuthorization()

	return (
		<LayoutShell
			user={pick(user.toJSON() as IUser, ["name"] as const)}
		>
			{children}
		</LayoutShell>
	)
}
