"use client"

import type { IUser } from "@models/typings/User"
import { ActionIcon, Avatar, Divider, Paper, Popover, Skeleton, Title } from "@mantine/core"
import { getNotifications } from "./actions/getNotifications"
import { MdNotifications } from "react-icons/md"
import { useDisclosure } from "@mantine/hooks"
import { twJoin } from "tailwind-merge"
import getNameInitials from "@helpers/getNameInitials"
import Notification from "./Notification"
import parseString from "@helpers/parseString"
import useSWR from "swr"

interface NotificationsProps {
	user: Pick<IUser, "accountType"> & {
		id: string
	}
}

export default function Notifications({ user }: NotificationsProps){
	const [opened, { toggle, open, close }] = useDisclosure()

	const {
		data: notifications,
		error,
		mutate,
		isLoading
	} = useSWR(`notifications-${user.id}`, async () => {
		const notifications = await getNotifications()

		if("errors" in notifications){
			throw notifications.errors[0]
		}

		return notifications
	}, {
		dedupingInterval: 5000,
		revalidateIfStale: false,
		revalidateOnMount: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		refreshWhenOffline: false,
		refreshWhenHidden: false,
		keepPreviousData: true
	})

	return (
		<Popover
			styles={{
				dropdown: {
					width: undefined
				}
			}}
			opened={opened}
			onChange={opened => opened ? open() : close()}
			position="bottom"
			closeOnClickOutside
			closeOnEscape
			returnFocus
			withArrow
			zIndex={5}
		>
			<Popover.Target>
				<ActionIcon
					size="lg"
					variant="default"
					onClick={() => {
						toggle()
						mutate()
					}}
				>
					<MdNotifications className="text-[1.25rem]" />
				</ActionIcon>
			</Popover.Target>

			<Popover.Dropdown
				className={twJoin(
					"w-11/12 max-w-screen-xs p-lg shadow-md",
					"supports-[width:clamp(0px,0vw,0px)]:!w-[clamp(200px,70vw,theme('screens.xs'))] supports-[width:clamp(0px,0vw,0px)]:!max-w-unset"
				)}
				component="section"
			>
				<div className="flex flex-col gap-2xl">
					<header>
						<Title
							order={1}
							fz="lg"
						>
							Notificações
						</Title>
					</header>

					{error || (!isLoading && !notifications?.length) ? (
						<p>
							{error
								? "Ocorreu um erro ao carregar as notificações."
								: "Nenhuma notificação encontrada"
							}
						</p>
					) : (
						<ul
							className={twJoin(
								"flex flex-col gap-xl",
								"max-h-[calc(85vh-var(--app-shell-header-height,3.75rem))] overflow-auto overscroll-contain",
								"[&::-webkit-scrollbar]:w-3.5",
								"[&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb]:bg-dark-400 [&::-webkit-scrollbar-thumb]:rounded-full",
								"[&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-transparent"
							)}
						>
							{(isLoading ? new Array(3).fill(null) as null[] : notifications!).map((notification, index) => (
								<Paper
									bg="dark.5"
									className="p-md rounded shadow-sm"
									component="li"
									key={notification?._id || index}
								>
									<Notification
										className="flex flex-col gap-md"
										handleClose={close}
										accountType={user.accountType}
										exam={notification?.exam?._id.toString()}
									>
										{!!notification?.owner && <>
											<div className="flex items-center gap-md">
												<Avatar
													className="flex-shrink-0 leading-none"
													name={notification.owner.name}
													size="md"
													radius="xl"
													color="initials"
												>
													{getNameInitials(notification.owner.name)}
												</Avatar>

												<div className="w-full">
													<p className="text-sm font-medium">{notification.owner.name}</p>
													<p className="text-dark-200 text-xs">{notification.owner.username}</p>
												</div>
											</div>

											<Divider />
										</>}

										<div className="flex flex-col gap-sm">
											{notification ? <>
												<p className="text-h5">{notification.title}</p>
												<p className="text-sm">{parseString(notification.content)}</p>
											</> : <>
												<Skeleton width="40%" height="1.15em" />

												<div className="flex flex-col gap-xs">
													<Skeleton width="90%" height="1em" />
													<Skeleton width="80%" height="1em" />
												</div>
											</>}
										</div>
									</Notification>
								</Paper>
							))}
						</ul>
					)}
				</div>
			</Popover.Dropdown>
		</Popover>
	)
}
