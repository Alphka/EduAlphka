"use client"

import type { ReactNode } from "react"
import { Grid } from "@mantine/core"

export default function ExamListContainer({ children}: { children: ReactNode }){
	return (
		<Grid>
			<Grid.Col
				span={{
					base: 12,
					md: 6,
					lg: 4
				}}
			>
				{children}
			</Grid.Col>
		</Grid>
	)
}
