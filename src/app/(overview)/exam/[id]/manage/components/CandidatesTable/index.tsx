"use client"

import { getSubmitStatus, submitStatusColors, submitStatusPriority, type SubmitStatus } from "@helpers/getSubmitStatus"
import { useMemo, useState, type ChangeEventHandler } from "react"
import { Table, Text, TextInput, Title } from "@mantine/core"
import { MdSearch } from "react-icons/md"
import Th from "./Th"
import Tr from "./Tr"

const filters = ["name", "status", "startedAt"] as const

type FilterTypes = typeof filters[number]

export interface CandidatesRowData {
	id: string
	name: string
	email: string
	username: string
	/** Started exam date */
	startedAt?: string
	hasAnswer: boolean
	isExpired: boolean
	pendingCorrection: boolean
}

export interface RowData extends Pick<CandidatesRowData, "id" | "name" | "username" | "startedAt" | "isExpired" | "hasAnswer" | "pendingCorrection"> {
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

			if(sortBy === "startedAt"){
				const dateA = a.startedAt ? parseDate(a.startedAt) : 0
				const dateB = b.startedAt ? parseDate(b.startedAt) : 0

				return reversed ? dateB - dateA : dateA - dateB
			}

			if(sortBy === "status"){
				const statusA = submitStatusPriority[a.status as SubmitStatus]
				const statusB = submitStatusPriority[b.status as SubmitStatus]

				return reversed ? statusB - statusA : statusA - statusB
			}

			return (reversed ? b : a)[sortBy].localeCompare((reversed ? a : b)[sortBy])
		})
		.filter(item => {
			const keys = Object.keys(item).filter(key => filters.includes(key as FilterTypes)) as FilterTypes[]
			return keys.some(key => (item[key] || "").toLocaleLowerCase().includes(query))
		})
}

export interface CandidatesTableProps {
	examId: string
	data: CandidatesRowData[]
}

export default function CandidatesTable({ examId, data }: CandidatesTableProps){
	const rowsData = useMemo(() => data.map(({ id, name, username, startedAt, pendingCorrection, hasAnswer, isExpired }) => ({
		id,
		name,
		status: getSubmitStatus({
			pendingCorrection,
			hasStartedExam: !!startedAt,
			hasAnswer,
			isExpired
		}),
		username,
		startedAt,
		isExpired,
		hasAnswer,
		pendingCorrection
	} as RowData)), [data])

	const [reverseSortDirection, setReverseSortDirection] = useState(false)
	const [sortedData, setSortedData] = useState(rowsData)
	const [sortBy, setSortBy] = useState<FilterTypes | null>(null)
	const [search, setSearch] = useState("")

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
		<section className="flex flex-col gap-md">
			<header>
				<Title order={2} fz="2xl">
					Candidatos participando do teste
				</Title>
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

			<Table.ScrollContainer minWidth={250}>
				<Table
					horizontalSpacing="xs"
					verticalSpacing="sm"
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
								sorted={sortBy === "startedAt"}
								reversed={reverseSortDirection}
								onSort={() => setSorting("startedAt")}
								ta="center"
							>
								<Text component="span" visibleFrom="xs">Data de início</Text>
								<Text component="span" hiddenFrom="xs" aria-hidden>Início</Text>
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
								ta="center"
								w="4%"
							/>
						</Table.Tr>
					</Table.Thead>

					<Table.Tbody>
						{sortedData.length > 0 ? sortedData.map(({
							id,
							name,
							username,
							startedAt,
							isExpired,
							hasAnswer,
							pendingCorrection
						}) => {
							const status = getSubmitStatus({
								pendingCorrection,
								hasStartedExam: !!startedAt,
								hasAnswer,
								isExpired
							})

							return (
								<Tr
									examId={examId}
									{...{
										id,
										name,
										status,
										username,
										startedAt,
										isExpired,
										hasAnswer,
										pendingCorrection
									}}
									statusColor={submitStatusColors[status]}
									key={id}
								/>
							)
						}) : (
							<Table.Tr>
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
	)
}
