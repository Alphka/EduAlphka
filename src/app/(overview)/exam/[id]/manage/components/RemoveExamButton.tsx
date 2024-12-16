"use client"

import { MdDeleteForever, MdWarningAmber } from "react-icons/md"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { Modal, Button, Title, Badge } from "@mantine/core"
import useServerActionHandler from "@hooks/useServerActionHandler"
import deleteExamAction from "@app/(overview)/exam/actions/deleteExam"

interface RemoveExamButtonProps {
	examName: string
	examId: string
}

export default function RemoveExamButton({ examId, examName }: RemoveExamButtonProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const [opened, { open, close }] = useDisclosure(false)
	const isMobile = useMediaQuery("(max-width: 50em)")

	return <>
		<Button
			className="flex-shrink-0"
			color="red"
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
				body: "flex flex-col px-3xl py-xl gap-4xl"
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

					<Title
						order={1}
						fz="h4"
						fw={500}
					>
						Deseja realmente excluir este teste?
					</Title>
				</div>

				<Title
					order={2}
					c="dimmed"
					fz="h6"
					fw={400}
				>
					Você está excluindo o teste "{examName}", deseja continuar?
				</Title>
			</header>

			<div className="flex items-center justify-end gap-lg">
				<Button
					className="flex-shrink-0"
					size="sm"
					color="gray"
					variant="light"
					onClick={close}
					aria-label="Cancelar"
				>
					Cancelar
				</Button>

				<Button
					className="flex-shrink-0"
					size="sm"
					color="red"
					variant="filled"
					aria-label="Excluir teste"
					onClick={() => handleServerAction(deleteExamAction(examId))}
					loading={isPending}
				>
					Excluir
				</Button>
			</div>
		</Modal>
	</>
}
