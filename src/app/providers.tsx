"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, NumberInput, Textarea, TextInput, Select } from "@mantine/core"
import { TimeInput } from "@mantine/dates"

interface ProviderProps {
	fontFamily: string
	children: ReactNode
}

export default function Providers({ fontFamily, children }: ProviderProps){
	const theme = createTheme({
		cursorType: "pointer",
		components: {
			TextInput: TextInput.extend({
				classNames: {
					label: "mb-1"
				}
			}),
			Textarea: Textarea.extend({
				classNames: {
					label: "mb-1"
				}
			}),
			NumberInput: NumberInput.extend({
				classNames: {
					label: "mb-1"
				}
			}),
			TimeInput: TimeInput.extend({
				classNames: {
					label: "mb-1",
					input: "[&::-webkit-calendar-picker-indicator]:hidden"
				}
			}),
			Select: Select.extend({
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
			forceColorScheme="dark"
			deduplicateCssVariables
		>
			{children}
		</MantineProvider>
	)
}
