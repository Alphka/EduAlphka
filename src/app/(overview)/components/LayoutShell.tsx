"use client"

import type { ReactNode } from "react"
import { AppShell, Burger, Avatar, NavLink } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { twJoin } from "tailwind-merge"
import CredentialsContext from "@contexts/CredentialsContext"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	children: ReactNode
}

export default function LayoutShell({ children }: LayoutShellProps){
	const { user } = useContext(CredentialsContext)
	const [opened, { toggle }] = useDisclosure()
	const pathname = usePathname()

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
				<div className="flex items-center justify-between px-4 py-2 gap-4">
					<div>
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
					</div>

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

						const isActive = (pathname === "/" || route.pathname === "/")
							? route.pathname === pathname
							: route.pathname === pathname || pathname.startsWith(route.pathname)

						return (
							<li
								className={twJoin(
									route.pathname === "/logout" && "flex-grow flex flex-col justify-end"
								)}
								key={key}
							>
								<NavLink
									href={route.pathname}
									label={route.title}
									active={isActive}
									component={Link}
									className="rounded"
									leftSection={<route.Icon className="text-base" />}
									prefetch={false}
								>
									{"children" in route && Object.entries(route.children).map(([childKey, childRoute]) => (
										<NavLink
											href={childRoute.pathname}
											label={childRoute.title}
											component={Link}
											prefetch={false}
											active={pathname === childRoute.pathname || childRoute.pathname.startsWith(pathname + "/")}
											key={childKey}
										/>
									))}
								</NavLink>
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
