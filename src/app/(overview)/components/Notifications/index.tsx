"use client"

import { ActionIcon, Avatar, Divider, Paper, Popover, Skeleton, Title } from "@mantine/core"
import { getNotifications } from "./actions/getNotifications"
import { MdNotifications } from "react-icons/md"
import getNameInitials from "@helpers/getNameInitials"
import parseString from "@helpers/parseString"
import useSWR from "swr"

interface NotificationsProps {
	userId: string
}

export default function Notifications({ userId }: NotificationsProps){
	const {
		data: notifications,
		error,
		mutate,
		isLoading
	} = useSWR(`notifications-${userId}`, async () => {
		const notifications = await getNotifications()

		if("errors" in notifications){
			throw notifications.errors[0]
		}

		return notifications
	}, {
		dedupingInterval: 1000,
		revalidateIfStale: false,
		revalidateOnMount: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		keepPreviousData: true
	})

	return (
		<Popover
			width={450}
			position="bottom"
			shadow="md"
			onChange={opened => {
				if(opened) mutate()
			}}
			returnFocus
			withArrow
		>
			<Popover.Target>
				<ActionIcon
					size="lg"
					variant="default"
				>
					<MdNotifications className="text-[1.25rem]" />
				</ActionIcon>
			</Popover.Target>

			<Popover.Dropdown component="section">
				<div className="flex flex-col p-md gap-2xl">
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
						<ul className="flex flex-col gap-xl">
							{(isLoading ? new Array(5).fill(null) as null[] : notifications!).map((notification, index) => (
								<Paper
									bg="dark.5"
									className="p-md rounded shadow-sm"
									component="li"
									key={notification?._id || index}
								>
									<div className="flex flex-col gap-md">
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
									</div>
								</Paper>
							))}
						</ul>
					)}
				</div>
			</Popover.Dropdown>
		</Popover>
	)
}
