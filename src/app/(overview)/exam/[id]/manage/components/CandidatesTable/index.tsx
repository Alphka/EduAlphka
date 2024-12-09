"use client"

import { useMemo, useState, type ChangeEventHandler } from "react"
import { Table, Text, TextInput, Title } from "@mantine/core"
import { MdSearch } from "react-icons/md"
import Th from "./Th"
import Tr from "./Tr"

const filters = ["name", "status", "startedAt"] as const

type FilterTypes = typeof filters[number]

export interface RowData extends Pick<CandidatesRowData, "name" | "username" | "startedAt" | "expired" | "answered" | "pendingCorrection"> {
	status: string
}

interface CandidatesRowData {
	name: string
	email: string
	username: string
	startedAt?: string
	pendingCorrection: boolean
	answered: boolean
	expired: boolean
}

interface CandidatesTableProps {
	data: CandidatesRowData[]
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
			return ((reversed ? b : a)[sortBy] || "").localeCompare((reversed ? a : b)[sortBy] || "")
		})
		.filter(item => {
			const keys = Object.keys(item).filter(key => filters.includes(key as FilterTypes)) as Array<FilterTypes>
			return keys.some(key => (item[key] || "").toLocaleLowerCase().includes(query))
		})
}

export function getAnswerStatus({ startedAt, pendingCorrection, answered, expired }: Pick<CandidatesRowData, "startedAt" | "pendingCorrection" | "answered" | "expired">){
	return startedAt
		? pendingCorrection
			? "Pendente"
			: expired
				? "Expirado"
				: answered
					? "Finalizado"
					: "Ativo"
		: "Não iniciado"
}

export default function CandidatesTable({ data }: CandidatesTableProps){
	const rowsData: RowData[] = useMemo(() => data.map(({ name, username, startedAt, pendingCorrection, answered, expired }) => ({
		name,
		expired,
		answered,
		username,
		startedAt,
		pendingCorrection,
		status: getAnswerStatus({ startedAt, pendingCorrection, answered, expired })
	})), [data])

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
				value={search}
				placeholder="Pesquisar..."
				aria-label="Pesquisar"
				leftSection={<MdSearch className="text-base" />}
				onChange={handleSearchChange}
			/>

			<Table.ScrollContainer minWidth={500}>
				<Table
					horizontalSpacing="sm"
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
								sorted={sortBy === "startedAt"}
								reversed={reverseSortDirection}
								onSort={() => setSorting("startedAt")}
								ta="center"
								w="12%"
							>
								Data de início
							</Th>

							<Th
								sorted={sortBy === "status"}
								reversed={reverseSortDirection}
								onSort={() => setSorting("status")}
								ta="center"
								w="10%"
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
						{sortedData.length > 0 ? sortedData.map(({ name, username, startedAt, expired, answered, pendingCorrection }) => {
							const status = getAnswerStatus({ startedAt, pendingCorrection, answered, expired })

							return (
								<Tr
									{...{
										name,
										status,
										expired,
										answered,
										username,
										startedAt,
										pendingCorrection
									}}
									key={name}
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
