"use client"

import { getSubmitStatus, submitStatusColors, SubmitStatus } from "@helpers/getSubmitStatus"
import { useMemo, useState, type ChangeEventHandler } from "react"
import { Divider, Paper, Table, Text, TextInput } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { MdSearch } from "react-icons/md"
import DisabledCandidatesTable from "./components/DisabledCandidatesTable"
import AddCandidate from "./components/AddCandidate"
import Th from "./Th"
import Tr from "./Tr"

const filters = ["name", "status", "createdAt"] as const

type FilterTypes = typeof filters[number]

export interface CandidatesRowData {
	id: string
	name: string
	submitId?: string
	username: string
	/** Started exam date */
	createdAt?: string
	isExpired: boolean
	pendingCorrection: boolean
}

export interface RowData extends Pick<CandidatesRowData, "id" | "name" | "username" | "createdAt" | "isExpired" | "submitId" | "pendingCorrection"> {
	status: SubmitStatus
}

function parseDate(date: string){
	const [day, month, year] = date.split("/").map(Number)
	return Date.UTC(year, month - 1, day)
}

function sortData(data: RowData[], { search, sortBy, reversed }: {
	search: string
	sortBy: FilterTypes | null
	reversed: boolean
}){
	const query = search.trim().toLocaleLowerCase()

	return data
		.toSorted((a, b) => {
			if(!sortBy) return 0

			if(sortBy === "createdAt"){
				const dateA = a.createdAt ? parseDate(a.createdAt) : 0
				const dateB = b.createdAt ? parseDate(b.createdAt) : 0

				return reversed ? dateB - dateA : dateA - dateB
			}

			if(sortBy === "status"){
				const statusA = a.status
				const statusB = b.status

				return reversed ? statusB - statusA : statusA - statusB
			}

			return (reversed ? b : a)[sortBy].localeCompare((reversed ? a : b)[sortBy])
		})
		.filter(item => {
			const keys = Object.keys(item).filter(key => filters.includes(key as FilterTypes)) as FilterTypes[]

			return keys.some(key => {
				const rowData = item[key as Exclude<typeof key, "status">]

				if(!rowData) return false

				if(key === "status"){
					return SubmitStatus[rowData as unknown as SubmitStatus].toLocaleLowerCase().includes(query)
				}

				return rowData.toLocaleLowerCase().includes(query)
			})
		})
}

export interface CandidatesTableProps {
	examId: string
	data: CandidatesRowData[]
	disallowedCandidates: Pick<CandidatesRowData, "id" | "name" | "username">[]
}

export default function CandidatesTable({ examId, data, disallowedCandidates }: CandidatesTableProps){
	const rowsData = useMemo(() => data.map(data => ({
		status: getSubmitStatus({
			pendingCorrection: data.pendingCorrection,
			hasStartedExam: !!data.createdAt,
			hasSubmit: !!data.submitId,
			isExpired: data.isExpired
		}),
		...data
	} as RowData)), [data])

	const [reverseSortDirection, setReverseSortDirection] = useState(false)
	const [sortedData, setSortedData] = useState(rowsData)
	const [sortBy, setSortBy] = useState<FilterTypes | null>(null)
	const [search, setSearch] = useState("")

	const isMobile = useMediaQuery("(max-width: 500px)")

	const setSorting = (field: FilterTypes) => {
		const reversed = field === sortBy ? !reverseSortDirection : false

		setSortBy(field)
		setReverseSortDirection(reversed)
		setSortedData(sortData(rowsData, { search, sortBy: field, reversed }))
	}

	const handleSearchChange: ChangeEventHandler<HTMLInputElement> = event => {
		const { value: search } = event.currentTarget

		setSearch(search)
		setSortedData(sortData(rowsData, { search, sortBy, reversed: reverseSortDirection }))
	}

	return (
		<Paper
			className="flex flex-col p-xl gap-lg"
			withBorder
		>
			<section className="flex flex-col gap-md">
				<header>
					<h2 className="text-h5">
						Candidatos participando do teste
					</h2>
				</header>

				<TextInput
					size="sm"
					value={search}
					placeholder="Pesquisar..."
					aria-label="Pesquisar"
					leftSection={<MdSearch className="text-base" />}
					enterKeyHint="search"
					onChange={handleSearchChange}
					disabled={!data.length}
				/>

				<Table.ScrollContainer minWidth={300}>
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
								<Th
									sorted={sortBy === "name"}
									reversed={reverseSortDirection}
									onSort={() => setSorting("name")}
								>
									Candidato
								</Th>

								<Th
									className="w-16 xs:w-36"
									sorted={sortBy === "createdAt"}
									reversed={reverseSortDirection}
									onSort={() => setSorting("createdAt")}
									ta="center"
								>
									<span className="hidden xs:block">Data de início</span>
									<span className="block xs:hidden" aria-hidden>Início</span>
								</Th>

								<Th
									className="w-1/12"
									sorted={sortBy === "status"}
									reversed={reverseSortDirection}
									onSort={() => setSorting("status")}
									ta="center"
								>
									Status
								</Th>

								<Table.Th
									w="4%"
									ta="center"
								/>
							</Table.Tr>
						</Table.Thead>

						<Table.Tbody>
							{sortedData.length > 0 ? sortedData.map(({
								id,
								name,
								status,
								username,
								createdAt,
								isExpired,
								submitId,
								pendingCorrection
							}) => (
								<Tr
									{...{
										id,
										name,
										examId,
										status,
										submitId,
										username,
										createdAt,
										isExpired,
										pendingCorrection
									}}
									statusColor={submitStatusColors[status]}
									key={id}
								/>
							)) : (
								<Table.Tr key="not-found">
									<Table.Td colSpan={4}>
										<Text fw={500} ta="center">
											Nenhum usuário encontrado
										</Text>
									</Table.Td>
								</Table.Tr>
							)}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			</section>

			<AddCandidate examId={examId} />

			{!!disallowedCandidates.length && <>
				<Divider />

				<section className="flex flex-col gap-md">
					<header>
						<h3 className="text-h6 font-semibold">
							Candidatos desativados do teste
						</h3>
					</header>

					<DisabledCandidatesTable
						{...{
							examId,
							disallowedCandidates
						}}
					/>
				</section>
			</>}
		</Paper>
	)
}
