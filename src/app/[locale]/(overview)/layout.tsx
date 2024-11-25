import type { RootLayoutProps } from "../layout"
import { Avatar, Button } from "@mantine/core"
import { getDictionary } from "@dictionaries"
import { twJoin } from "tailwind-merge"
import verifyAuthorization from "@helpers/verifyAuthorization"
import getRouteWithLocale from "@helpers/getRouteWithLocale"
import getNameInitials from "@helpers/getNameInitials"
import getRequestURL from "@helpers/getRequestURL"
import routes from "@app/routes"
import Link from "next/link"

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
		<div className="flex">
			<ul
				className={twJoin(
					"basis-56 bg-neutral-100 dark:bg-neutral-800 flex flex-col px-4 py-3 gap-4 h-dvh",
					"border-r border-r-neutral-800 dark:border-r-neutral-600",
					"max-sm:hidden"
				)}
			>
				{Object.entries(routes).map(([key, route]) => {
					if(!("Icon" in route)) return null

					const pageDictionary = dictionary[key as keyof typeof dictionary]

					if(!pageDictionary) throw new Error("Page does not exist in dictionary object: " + key)
					if(!("title" in pageDictionary)) return null

					const isLogout = route.pathname === "/logout"

					return (
						<li
							className={twJoin(isLogout && "flex-grow flex flex-col justify-end")}
							key={key}
						>
							<Button
								href={isLogout ? route.pathname : getRouteWithLocale(route.pathname, locale)}
								variant={isLogout ? "transparent" : getRouteWithLocale(route.pathname, locale).startsWith(pathname) ? "filled" : "light"}
								justify="left"
								leftSection={<route.Icon className="text-lg" />}
								component={Link}
								prefetch={false}
								fullWidth
							>
								{pageDictionary.title}
							</Button>
						</li>
					)
				})}
			</ul>

			<div className="flex-grow h-full flex flex-col overflow-hidden">
				<div
					className={twJoin(
						"flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-between px-4 py-2 gap-4",
						"border-b border-b-neutral-800 dark:border-b-neutral-600"
					)}
				>
					<div />

					<div className="flex items-center gap-2">
						<Avatar
							radius="xl"
							name={user.name}
							color="initials"
							allowedInitialsColors={[
								"red",
								"pink",
								"grape",
								"violet",
								"indigo",
								"blue",
								"cyan",
								"green",
								"yellow",
								"orange",
								"teal"
							]}
						>
							{getNameInitials(user.name)}
						</Avatar>
					</div>
				</div>

				{children}
			</div>
		</div>
	)
}
