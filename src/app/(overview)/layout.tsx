import type { RootLayoutProps } from "../layout"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import LayoutShell from "./components/LayoutShell"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ children }: LayoutProps){
	const user = await verifyAuthorization()

	return (
		<LayoutShell
			user={pick(user, ["name", "accountType"] as const)}
		>
			{children}
		</LayoutShell>
	)
}
