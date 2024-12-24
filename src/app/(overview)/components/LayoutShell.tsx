"use client"

import type { ReactNode } from "react"
import type { IUser } from "@models/typings/User"
import { AppShell, Burger, Avatar, NavLink } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { twJoin } from "tailwind-merge"
import { omit } from "lodash"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	user: Pick<IUser, "name" | "accountType">
	children: ReactNode
}

export default function LayoutShell({ user, children }: LayoutShellProps){
	const [burgerOpened, { close, toggle: toggleBurger }] = useDisclosure()
	const pathname = usePathname()

	useEffect(() => {
		close()
	}, [pathname])

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
			zIndex={1}
		>
			<AppShell.Header>
				<div className="h-full flex items-center justify-between p-md gap-md">
					<div>
						<Burger
							opened={burgerOpened}
							onClick={toggleBurger}
							hiddenFrom="sm"
							size="md"
						/>
					</div>

					<div className="flex gap-md">
						<Avatar
							name={user.name}
							size="md"
							radius="xl"
							color="initials"
							className="leading-none"
						>
							{getNameInitials(user.name)}
						</Avatar>
					</div>
				</div>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<ul className="h-full flex flex-col justify-end">
					{Object.entries(routes).map(([key, route]) => {
						if(!("Icon" in route)) return null
						if("access" in route && user.accountType !== route.access) return null

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
												className="rounded-b"
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
				</ul>
			</AppShell.Navbar>

			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
}
