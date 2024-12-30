"use client"

import { MdDeleteForever, MdWarningAmber } from "react-icons/md"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { Modal, Button, Badge } from "@mantine/core"
import useServerActionHandler from "@hooks/useServerActionHandler"
import deleteExamAction from "../../../actions/deleteExam"

interface RemoveExamButtonProps {
	examName: string
	examId: string
}

export default function RemoveExamButton({ examId, examName }: RemoveExamButtonProps){
	const { handleServerAction, isPending } = useServerActionHandler({ autoClose: 10e3 })
	const [opened, { open, close }] = useDisclosure(false)
	const isMobile = useMediaQuery("(max-width: 50em)")

	return <>
		<Button
			className="flex-shrink-0"
			color="red.9"
			variant="filled"
			leftSection={<MdDeleteForever className="text-lg" />}
			onClick={open}
		>
			Excluir teste
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
						Deseja realmente excluir este teste?
					</h1>
				</div>

				<h2 className="text-dark-200 text-h6 font-normal">
					Você está excluindo o teste "{examName}", deseja continuar?
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
					onClick={() => handleServerAction(deleteExamAction(examId))}
					aria-label="Excluir teste"
					loading={isPending}
				>
					Excluir
				</Button>
			</div>
		</Modal>
	</>
}
