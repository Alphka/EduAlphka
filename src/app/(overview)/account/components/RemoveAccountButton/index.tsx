"use client"

import type { IUser } from "@models/typings/User"
import { MdDeleteForever } from "react-icons/md"
import { useDisclosure } from "@mantine/hooks"
import { Button } from "@mantine/core"
import RemoveAccountModal from "./Modal"

export interface RemoveAccountButtonProps {
	user: Pick<IUser, "accountType">
}

export default function RemoveAccountButton({ user }: RemoveAccountButtonProps){
	const [opened, { open, close }] = useDisclosure(false)

	return <>
		<Button
			size="md"
			color="red"
			className="self-start"
			leftSection={<MdDeleteForever className="max-xs:hidden text-lg" />}
			aria-label="Excluir conta"
			onClick={open}
		>
			Excluir conta
		</Button>

		<RemoveAccountModal
			opened={opened}
			onClose={close}
			user={user}
		/>
	</>
}
