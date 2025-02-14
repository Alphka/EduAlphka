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
import Notifications from "./Notifications"
import routes from "@app/routes"
import Link from "next/link"

interface LayoutShellProps {
	user: Pick<IUser, "name" | "accountType"> & { id: string }
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
			zIndex={5}
		>
			<AppShell.Header>
				<div className="h-full flex items-center justify-between p-md gap-md">
					<div className="flex items-center justify-center">
						<Burger
							size="md"
							hiddenFrom="sm"
							opened={burgerOpened}
							onClick={toggleBurger}
						/>
					</div>

					<div className="flex items-center gap-lg overflow-hidden">
						<div className="flex items-center pl-sm gap-md *:flex-shrink-0">
							<Notifications userId={user.id} />
						</div>

						<div className="w-full flex items-center gap-md">
							<div className="text-right overflow-hidden">
								<p className="text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden">
									{user.name}
								</p>
								<p className="text-dark-100 text-xs whitespace-nowrap text-ellipsis overflow-hidden">
									{user.accountType === "professor" ? "Aplicador de testes" : "Candidato"}
								</p>
							</div>

							<Avatar
								className="flex-shrink-0 leading-none"
								name={user.name}
								size="md"
								radius="xl"
								color="initials"
							>
								{getNameInitials(user.name)}
							</Avatar>
						</div>
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
									className="rounded"
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
												className="rounded"
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
