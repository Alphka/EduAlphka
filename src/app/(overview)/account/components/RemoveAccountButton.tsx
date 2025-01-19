"use client"

import type { IUser } from "@models/typings/User"
import { MdDeleteForever, MdWarningAmber } from "react-icons/md"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { Badge, Button, Modal } from "@mantine/core"
import useServerActionHandler from "@hooks/useServerActionHandler"
import removeAccount from "../actions/removeAccount"

interface RemoveAccountButtonProps {
	user: Pick<IUser, "accountType">
}

export default function RemoveAccountButton({ user }: RemoveAccountButtonProps){
	const { handleServerAction, isPending } = useServerActionHandler({})
	const [opened, { open, close }] = useDisclosure(false)
	const isMobile = useMediaQuery("(max-width: 50em)")

	return <>
		<Button
			size="md"
			color="red"
			className="self-start"
			leftSection={<MdDeleteForever className="text-lg" />}
			aria-label="Excluir conta"
			onClick={open}
		>
			Excluir conta
		</Button>

		<Modal
			size="auto"
			opened={opened}
			onClose={close}
			fullScreen={isMobile}
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

			<div className="flex items-center justify-end gap-lg">
				<Button
					className="flex-shrink-0"
					size="sm"
					color="gray"
					variant="light"
					onClick={close}
					aria-label="Cancelar exclusão"
				>
					Cancelar
				</Button>

				<Button
					className="flex-shrink-0"
					size="sm"
					color="red"
					variant="filled"
					onClick={() => handleServerAction(removeAccount())}
					aria-label="Excluir conta"
					loading={isPending}
				>
					Excluir
				</Button>
			</div>
		</Modal>
	</>
}
