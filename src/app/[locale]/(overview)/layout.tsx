import type { RootLayoutProps } from "../layout"
import type { IUser } from "@models/typings/User"
import { getDictionary } from "@dictionaries"
import { pick } from "lodash"
import verifyAuthorization from "@helpers/verifyAuthorization"
import getRequestURL from "@helpers/getRequestURL"
import LayoutShell from "./components/LayoutShell"

interface LayoutProps extends RootLayoutProps {}

export default async function Layout({ params, children }: LayoutProps){
	const { locale } = await params
	const [url, dictionary, user] = await Promise.all([
		getRequestURL(),
		getDictionary(locale),
		verifyAuthorization({ locale })
	])

	const { pathname } = new URL(url!)

	return (
		<LayoutShell
			{...{
				dictionary,
				pathname,
				locale,
				user: pick(user.toJSON() as IUser, ["name"] as const)
			}}
		>
			{children}
		</LayoutShell>
	)
}
