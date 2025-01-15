import type { CandidatesTableProps, RowData } from "."
import { ActionIcon, Avatar, Badge, Menu, MenuDropdown, MenuItem, MenuTarget, Table } from "@mantine/core"
import { MdMenu, MdEdit, MdChecklist } from "react-icons/md"
import { useMediaQuery } from "@mantine/hooks"
import RemoveCandidateButton from "./components/RemoveCandidateButton"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"
import Link from "next/link"

interface TrProps extends
	Pick<RowData, "id" | "name" | "username" | "status" | "startedAt" | "submitId" | "isExpired" | "pendingCorrection">,
	Pick<CandidatesTableProps, "examId"> {
	statusColor: string
}

export default function Tr({
	pendingCorrection,
	statusColor,
	startedAt,
	submitId,
	username,
	examId,
	status,
	name,
	id
}: TrProps){
	const isMobile = useMediaQuery("(max-width: 400px)")

	return (
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
				{startedAt || "-"}
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
									href={routes.submit.children.template.pathname.replace("[id]", submitId)}
									component={Link}
									leftSection={pendingCorrection
										? <MdEdit className="text-base" />
										: <MdChecklist className="text-base" />
									}
									px="md"
									py="sm"
								>
									{pendingCorrection ? "Corrigir respostas" : "Visualizar respostas"}
								</MenuItem>
							)}

							<RemoveCandidateButton
								candidateId={id}
								examId={examId}
								px="md"
								py="sm"
								disabled={!!startedAt}
							/>
						</MenuDropdown>
					</Menu>
				</div>
			</Table.Td>
		</Table.Tr>
	)
}

//? TODO: Show badge for feedbacks
//? TODO: Include remaining time for exam expiration
