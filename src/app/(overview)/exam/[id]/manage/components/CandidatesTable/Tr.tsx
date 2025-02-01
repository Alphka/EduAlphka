import type { CandidatesTableProps, RowData } from "."
import { ActionIcon, Avatar, Badge, Button, Menu, MenuDropdown, MenuItem, MenuTarget, Modal, Table } from "@mantine/core"
import { MdMenu, MdEdit, MdChecklist, MdWarningAmber, MdDeleteOutline, MdOutlineDoNotDisturbOn } from "react-icons/md"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { removeCandidate } from "../../actions/candidates"
import useServerActionHandler from "@hooks/useServerActionHandler"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface TrProps extends
	Pick<RowData, "id" | "name" | "username" | "status" | "createdAt" | "submitId" | "isExpired" | "pendingCorrection">,
	Pick<CandidatesTableProps, "examId"> {
	statusColor: string
}

export default function Tr({
	pendingCorrection,
	statusColor,
	createdAt,
	submitId,
	username,
	examId,
	status,
	name,
	id
}: TrProps){
	const [disableModalOpened, { open: openDisableModal, close: closeDisableModal }] = useDisclosure(false)
	const { handleServerAction, isPending } = useServerActionHandler({
		successOptions: {
			action: closeDisableModal
		},
		errorOptions: {
			action: closeDisableModal
		}
	})

	const isMobile = useMediaQuery("(max-width: 500px)")

	return <>
		<Table.Tr>
			<Table.Td>
				<div className="flex items-center gap-sm">
					<Avatar
						className="flex-shrink-0 leading-none"
						name={name}
						size="md"
						radius="xl"
						color="initials"
					>
						{getNameInitials(name)}
					</Avatar>

					<div>
						<p className="text-sm font-medium">{name}</p>
						<p className="text-dark-200 text-xs">{username}</p>
					</div>
				</div>
			</Table.Td>

			<Table.Td ta="center">
				{createdAt || "-"}
			</Table.Td>

			{/* TODO: Include candidate's grade */}

			<Table.Td>
				<Badge
					color={statusColor}
					variant="light"
					size={isMobile ? "xs" : "sm"}
					fullWidth
				>
					{status}
				</Badge>
			</Table.Td>

			<Table.Td>
				<div className="flex items-center justify-center">
					<Menu
						position="bottom-end"
						transitionProps={{ transition: "pop" }}
						trigger="click"
						openDelay={100}
						closeDelay={400}
						menuItemTabIndex={0}
						withinPortal
						withArrow
					>
						<MenuTarget>
							<ActionIcon
								color="gray"
								variant="subtle"
							>
								<MdMenu className="text-base" />
							</ActionIcon>
						</MenuTarget>

						<MenuDropdown>
							{!!submitId && (
								<MenuItem
									px="md"
									py="sm"
									href={routes.submit.children.template.pathname.replace("[id]", submitId)}
									component={Link}
									leftSection={pendingCorrection
										? <MdEdit className="text-base" />
										: <MdChecklist className="text-base" />
									}
								>
									{pendingCorrection ? "Corrigir respostas" : "Visualizar respostas"}
								</MenuItem>
							)}

							<MenuItem
								px="md"
								py="sm"
								color="red.9"
								leftSection={<MdDeleteOutline className="text-base" />}
								aria-label="Remover acesso do candidato ao teste"
								onClick={() => handleServerAction(removeCandidate(examId, id))}
								disabled={!!createdAt || isPending}
							>
								Remover acesso
							</MenuItem>

							<MenuItem
								px="md"
								py="sm"
								color="red.9"
								leftSection={<MdOutlineDoNotDisturbOn className="text-base" />}
								aria-label="Desativar candidato do teste"
								onClick={openDisableModal}
								disabled={!!createdAt || isPending}
							>
								Desativar
							</MenuItem>
						</MenuDropdown>
					</Menu>
				</div>
			</Table.Td>
		</Table.Tr>

		<Modal
			size="auto"
			opened={disableModalOpened}
			onClose={closeDisableModal}
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
						Deseja desativar o candidato do teste?
					</h1>
				</div>

				<h2 className="text-dark-200 text-h6 font-normal">
					Você está desativando o candidato "{name}".
					<br />
					Ele não poderá participar do teste novamente até que ele seja reativado.
				</h2>
			</header>

			<div className="flex flex-col xs:flex-row items-end xs:items-center xs:justify-end gap-lg">
				<Button
					className="flex-shrink-0 w-full xs:w-auto"
					size="sm"
					color="gray"
					variant="light"
					onClick={closeDisableModal}
					aria-label="Cancelar ação"
				>
					Cancelar
				</Button>

				<Button
					className="flex-shrink-0 w-full xs:w-auto"
					size="sm"
					color="red"
					variant="filled"
					onClick={() => handleServerAction(removeCandidate(examId, id, true))}
					aria-label="Desativar candidato do teste"
					loading={isPending}
				>
					Desativar
				</Button>
			</div>
		</Modal>
	</>
}

//? TODO: Include remaining time for exam expiration
