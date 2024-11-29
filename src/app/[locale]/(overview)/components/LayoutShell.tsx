"use client"

import type { Dictionary } from "@dictionaries"
import type { ReactNode } from "react"
import type { Locales } from "@src/i18n"
import type { IUser } from "@models/typings/User"
import { AppShell, Burger, Avatar, NavLink } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { twJoin } from "tailwind-merge"
import getRouteWithLocale from "@helpers/getRouteWithLocale"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	dictionary: Dictionary
	children: ReactNode
	pathname: string
	locale: Locales
	user: Pick<IUser, "name">
}

export default function LayoutShell({
	dictionary,
	children,
	pathname,
	locale,
	user
}: LayoutShellProps){
	const [opened, { toggle }] = useDisclosure()

	return (
		<AppShell
			header={{
				height: 60
			}}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: {
					mobile: !opened
				}
			}}
			padding="lg"
		>
			<AppShell.Header>
				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom="sm"
					size="sm"
				/>

				<div className="flex items-center justify-between px-4 py-2 gap-4">
					<div />

					<div className="flex items-center gap-2">
						<Avatar
							name={user.name}
							size="md"
							radius="xl"
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
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<ul className="flex-grow flex flex-col">
					{Object.entries(routes).map(([key, route]) => {
						if(!("Icon" in route)) return null

						const pageDictionary = dictionary[key as keyof typeof dictionary]

						if(!pageDictionary) throw new Error("Page does not exist in dictionary object: " + key)
						if(!("title" in pageDictionary)) return null

						const isActive = getRouteWithLocale(route.pathname, locale).startsWith(pathname)
						const isLogout = route.pathname === "/logout"

						return (
							<li
								className={twJoin(isLogout && "flex-grow flex flex-col justify-end")}
								key={key}
							>
								<NavLink
									href={getRouteWithLocale(route.pathname, locale)}
									label={pageDictionary.title}
									active={isActive}
									component={Link}
									className="rounded"
									leftSection={<route.Icon size="1rem" />}
									prefetch={false}
								/>
							</li>
						)
					})}
				</ul>
			</AppShell.Navbar>

			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
}
