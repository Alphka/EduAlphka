"use client"

import type { ReactNode } from "react"
import type { IUser } from "@models/typings/User"
import { AppShell, Burger, Avatar, NavLink } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	user: Pick<IUser, "name">
	children: ReactNode
}

export default function LayoutShell({ user, children }: LayoutShellProps){
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
			padding="xl"
		>
			<AppShell.Header>
				<div className="h-full flex items-center justify-between px-sm gap-md">
					<div>
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
					</div>

					<div className="flex items-center gap-md">
						<Avatar
							name={user.name}
							size="md"
							radius="xl"
							color="initials"
							className="leading-none"
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

						const isActive = (route: string) => {
							if(pathname === "/" || route === "/") return route === pathname
							return route === pathname || pathname.startsWith(route) // || route.startsWith(pathname + "/")
						}

						const hasChildren = "children" in route && !!Object.keys(route.children).length
						const isOpened = hasChildren && Object.entries(route.children).some(([, childRoute]) => isActive(childRoute.pathname))

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
									active={isActive(route.pathname)}
									opened={isOpened}
									component={Link}
									className={twJoin(
										"rounded",
										hasChildren && "data-[expanded=true]:rounded-none data-[expanded=true]:rounded-l data-[expanded=true]:rounded-t"
									)}
									leftSection={<route.Icon className="text-base" />}
									prefetch={false}
								>
									{hasChildren && Object.entries(route.children).map(([childKey, childRoute]) => (
										<NavLink
											href={childRoute.pathname}
											label={childRoute.title}
											component={Link}
											className="rounded-b"
											active={isActive(childRoute.pathname)}
											prefetch={false}
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
