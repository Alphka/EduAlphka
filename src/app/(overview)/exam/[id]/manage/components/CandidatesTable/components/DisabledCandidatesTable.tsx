"use client"

import type { CandidatesRowData } from ".."
import { ActionIcon, Avatar, Menu, MenuDropdown, MenuItem, MenuTarget, Table } from "@mantine/core"
import { MdAddCircleOutline, MdMenu } from "react-icons/md"
import { enableCandidate } from "../../../actions/candidates"
import { useMediaQuery } from "@mantine/hooks"
import useServerActionHandler from "@hooks/useServerActionHandler"
import getNameInitials from "@helpers/getNameInitials"

interface DisabledCandidatesTableProps {
	examId: string
	disallowedCandidates: Pick<CandidatesRowData, "id" | "name" | "username">[]
}

export default function DisabledCandidatesTable({ examId, disallowedCandidates }: DisabledCandidatesTableProps){
	const { handleServerAction, isPending } = useServerActionHandler()

	const isMobile = useMediaQuery("not all and (min-width: 500px)")

	return (
		<Table.ScrollContainer minWidth={180}>
			<Table
				className="bg-dark-600 rounded"
				horizontalSpacing={isMobile ? "sm" : "md"}
				verticalSpacing={isMobile ? "sm" : "md"}
				classNames={{
					th: isMobile ? "p-xs" : "p-md",
					td: isMobile ? "p-xs" : "p-md"
				}}
			>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>
							Candidato
						</Table.Th>

						<Table.Th
							w="4%"
							ta="center"
						/>
					</Table.Tr>
				</Table.Thead>

				<Table.Tbody>
					{disallowedCandidates.map(({ id, name, username }) => (
						<Table.Tr key={id}>
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
											<MenuItem
												px="md"
												py="sm"
												aria-label="Ativar candidato no teste"
												onClick={() => handleServerAction(enableCandidate(examId, id))}
												leftSection={<MdAddCircleOutline className="text-base" />}
												disabled={isPending}
											>
												Ativar candidato
											</MenuItem>
										</MenuDropdown>
									</Menu>
								</div>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</Table.ScrollContainer>
	)
}
