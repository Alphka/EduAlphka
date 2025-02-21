"use client"

import type { IUser } from "@models/typings/User"
import { MdDeleteForever, MdWarningAmber } from "react-icons/md"
import { Badge, Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import useServerActionHandler from "@hooks/useServerActionHandler"
import deleteUser from "../actions/deleteUser"

interface RemoveAccountButtonProps {
	user: Pick<IUser, "accountType">
}

export default function RemoveAccountButton({ user }: RemoveAccountButtonProps){
	const { handleServerAction, isPending } = useServerActionHandler({})
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

		<Modal
			size="auto"
			opened={opened}
			onClose={close}
			transitionProps={{ transition: "fade", duration: 200 }}
			withCloseButton={false}
			closeOnClickOutside
			closeOnEscape
			trapFocus
			centered
			classNames={{
				body: "flex flex-col justify-center px-3xl py-xl gap-4xl"
			}}
		>
			<header className="flex flex-col gap-md">
				<div className="flex items-center gap-md">
					<Badge
						size="xl"
						color="red"
						circle
						variant="light"
					>
						<MdWarningAmber />
					</Badge>

					<h1 className="text-h4 font-medium">
						Deseja realmente excluir a sua conta?
					</h1>
				</div>

				<h2 className="text-dark-200 text-h6 font-normal">
					Você está excluindo a sua conta na plataforma.{" "}
					{user.accountType === "professor" && <>
						<br />
						Todos os testes criados por você serão excluídos.
						<br />
					</>}
					Deseja continuar?
				</h2>
			</header>

			<div className="self-stretch flex flex-col xs:flex-row items-end xs:items-center xs:justify-end gap-lg">
				<Button
					className="flex-shrink-0 w-full xs:w-auto"
					size="sm"
					color="gray"
					variant="light"
					onClick={close}
					aria-label="Cancelar exclusão"
				>
					Cancelar
				</Button>

				<Button
					className="flex-shrink-0 w-full xs:w-auto"
					size="sm"
					color="red"
					variant="filled"
					onClick={async () => {
						await handleServerAction(deleteUser())
						close()
					}}
					aria-label="Excluir conta"
					loading={isPending}
				>
					Excluir
				</Button>
			</div>
		</Modal>
	</>
}
