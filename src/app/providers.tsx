"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, NumberInput, Textarea, TextInput } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import CredentialsContext, { type UserCredentials } from "./contexts/CredentialsContext"

interface ProviderProps {
	user: UserCredentials
	fontFamily: string
	children: ReactNode
}

export default function Providers({ user, fontFamily, children }: ProviderProps){
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
			})
		},
		fontFamily: fontFamily,
		headings: {
			fontFamily: fontFamily
		}
	})

	return (
		<CredentialsContext.Provider value={{ user }}>
			<MantineProvider
				theme={theme}
				withCssVariables
				forceColorScheme="dark"
				deduplicateCssVariables
			>
				{children}
			</MantineProvider>
		</CredentialsContext.Provider>
	)
}
