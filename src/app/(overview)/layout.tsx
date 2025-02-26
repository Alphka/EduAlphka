import type { RootLayoutProps } from "../layout"
import { Notification } from "@models"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import LayoutShell from "./components/LayoutShell"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ children }: LayoutProps){
	const user = await verifyAuthorization()

	let hasUnreadNotifications = false

	// TODO: Remove this when professors also receive notifications
	if(user.accountType === "candidate"){
		try{
			hasUnreadNotifications = !!(await Notification.exists({
				user: user.id,
				readAt: {
					$exists: false
				}
			}))
		}catch(error){
			console.error(error)
		}
	}

	return (
		<LayoutShell
			user={pick(user, ["id", "name", "accountType"] as const)}
			hasUnreadNotifications={hasUnreadNotifications}
		>
			{children}
		</LayoutShell>
	)
}
