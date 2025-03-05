"use client"

import type { IUser } from "@models/typings/User"
import { useMediaQuery } from "@mantine/hooks"
import { Avatar, Paper } from "@mantine/core"
import getNameInitials from "@helpers/getNameInitials"

interface AccountDetailsProps {
	user: Pick<IUser, "name" | "username" | "accountType">
}

export default function AccountDetails({ user }: AccountDetailsProps){
	const isMobile = useMediaQuery("not all and (min-width: 36em)")

	return (
		<Paper
			className="p-md md:p-lg rounded shadow-xs"
			withBorder
		>
			<div className="flex items-center gap-xl">
				<Avatar
					className="flex-shrink-0 leading-none"
					name={user.name}
					size={isMobile ? "lg" : "xl"}
					radius="100%"
					color="initials"
				>
					{getNameInitials(user.name)}
				</Avatar>

				<div>
					<p className="text-md xs:text-lg font-bold">
						{user.name}
					</p>
					<p className="text-dark-100 text-sm lg:text-md font-medium">
						{user.username}
					</p>
					<p className="text-dark-200 text-sm lg:text-md font-medium">
						{user.accountType === "professor" ? "Aplicador de testes" : "Candidato"}
					</p>
				</div>
			</div>
		</Paper>
	)
}
