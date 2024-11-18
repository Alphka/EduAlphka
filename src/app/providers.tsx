"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, TextInput } from "@mantine/core"

export default function Providers({ fontFamily, children }: {
	children: ReactNode
	fontFamily: string
}){
	const theme = createTheme({
		cursorType: "pointer",
		components: {
			TextInput: TextInput.extend({
				classNames: {
					label: "mb-1"
				}
			})
		},
		fontFamily: fontFamily,
		headings: {
			fontFamily: fontFamily
		}
	})

	return (
		<MantineProvider
			theme={theme}
			withCssVariables
			classNamesPrefix="css"
			withStaticClasses={false}
			defaultColorScheme="dark"
			deduplicateCssVariables
		>
			{children}
		</MantineProvider>
	)
}
