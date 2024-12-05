"use client"

import type { ReactNode } from "react"
import type { IUser } from "@models/typings/User"
import { AppShell, Burger, Avatar, NavLink, Stack, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { omit } from "lodash"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	user: Pick<IUser, "name">
	children: ReactNode
}

export default function LayoutShell({ user, children }: LayoutShellProps){
	const [burgerOpened, { toggle: toggleBurger }] = useDisclosure()
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
					mobile: !burgerOpened
				}
			}}
			padding="xl"
		>
			<AppShell.Header>
				<Group
					h="100%"
					p="sm"
					align="center"
					justify="space-between"
					gap="md"
				>
					<div>
						<Burger
							opened={burgerOpened}
							onClick={toggleBurger}
							hiddenFrom="sm"
							size="sm"
						/>
					</div>

					<Group gap="md">
						<Avatar
							name={user.name}
							size="md"
							radius="xl"
							color="initials"
							className="leading-none"
						>
							{getNameInitials(user.name)}
						</Avatar>
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<Stack
					h="100%"
					gap={0}
					justify="flex-end"
					component="ul"
				>
					{Object.entries(routes).map(([key, route]) => {
						if(!("Icon" in route)) return null

						const isActive = (route: string) => {
							if(pathname === "/" || route === "/") return route === pathname
							return route === pathname || pathname.startsWith(route) // || route.startsWith(pathname + "/")
						}

						const childrenWithoutTemplate = "children" in route && omit(route.children, "template")
						const hasChildren = "children" in route && !!Object.keys(childrenWithoutTemplate).length
						const opened = hasChildren && Object.entries(childrenWithoutTemplate).some(([, childRoute]) => isActive(childRoute.pathname))
						const active = isActive(route.pathname)

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
									active={active}
									opened={opened || undefined}
									component={Link}
									className={twJoin(
										"rounded",
										active && hasChildren && "data-[expanded=true]:rounded-none data-[expanded=true]:rounded-l data-[expanded=true]:rounded-t"
									)}
									leftSection={<route.Icon className="text-base" />}
									prefetch={false}
								>
									{hasChildren && Object.entries(childrenWithoutTemplate).map(([childKey, childRoute]) => {
										const active = isActive(childRoute.pathname)

										return (
											<NavLink
												href={childRoute.pathname}
												label={childRoute.title}
												component={Link}
												className={twJoin(active ? "rounded-b" : "rounded")}
												active={active}
												prefetch={false}
												key={childKey}
											/>
										)
									})}
								</NavLink>
							</li>
						)
					})}
				</Stack>
			</AppShell.Navbar>

			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
}
