import type { CandidatesTableProps, RowData } from "."
import { ActionIcon, Avatar, Badge, Menu, MenuDropdown, MenuItem, MenuTarget, Table, Text } from "@mantine/core"
import { MdMenu, MdEdit, MdChecklist } from "react-icons/md"
import { useMediaQuery } from "@mantine/hooks"
import RemoveCandidateButton from "./components/RemoveCandidateButton"

interface TrProps extends
	Pick<RowData, "id" | "name" | "username" | "status" | "startedAt" | "hasAnswer" | "isExpired" | "pendingCorrection">,
	Pick<CandidatesTableProps, "examId"> {
	statusColor: string
}

export default function Tr({
	pendingCorrection,
	statusColor,
	startedAt,
	hasAnswer,
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
						name={name}
						size="md"
						radius="xl"
						color="initials"
						className="leading-none"
					/>

					<div>
						<Text fz="sm" fw={500}>
							{name}
						</Text>
						<Text fz="xs" c="dimmed">
							{username}
						</Text>
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
							{pendingCorrection ? (
								<MenuItem
									px="md"
									py="sm"
									leftSection={<MdEdit className="text-base" />}
								>
									Corrigir respostas
								</MenuItem>
							) : hasAnswer && (
								<MenuItem
									px="md"
									py="sm"
									leftSection={<MdChecklist className="text-base" />}
								>
									Visualizar respostas
								</MenuItem>
							)}

							<RemoveCandidateButton
								examId={examId}
								candidateId={id}
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
