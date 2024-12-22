"use client"

import type { ReactNode } from "react"
import { Table, UnstyledButton, type TableThProps } from "@mantine/core"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { HiOutlineSelector } from "react-icons/hi"

interface ThProps extends Omit<TableThProps, "children" | "ref"> {
	children: ReactNode
	reversed: boolean
	sorted: boolean
	onSort: () => void
}

export default function Th({
	reversed,
	sorted,
	onSort,
	children,
	...props
}: ThProps){
	const Icon = sorted ? (reversed ? MdArrowDropUp : MdArrowDropDown) : HiOutlineSelector

	return (
		<Table.Th {...props}>
			<UnstyledButton onClick={onSort}>
				<div className="flex items-center justify-between gap-1">
					<div className="text-sm font-medium">{children}</div>

					<div className="flex items-center justify-center">
						<Icon className="text-base" />
					</div>
				</div>
			</UnstyledButton>
		</Table.Th>
	)
}
