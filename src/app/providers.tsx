"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, TextInput } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import ColorSchemeContext, { defaultTheme, type Themes } from "./contexts/ColorScheme"

export default function Providers({ fontFamily, children }: {
	children: ReactNode
	fontFamily: string
}){
	const [colorScheme, setColorScheme] = useLocalStorage<Themes>({
		key: "theme",
		defaultValue: defaultTheme,
		serialize: value => value,
		deserialize: value => value as Themes || defaultTheme
	})

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
		<ColorSchemeContext.Provider
			value={{
				colorScheme,
				onChange: setColorScheme
			}}
		>
			<MantineProvider
				theme={theme}
				withCssVariables
				classNamesPrefix="css"
				defaultColorScheme={colorScheme}
				withStaticClasses={false}
				deduplicateCssVariables
			>
				{children}
			</MantineProvider>
		</ColorSchemeContext.Provider>
	)
}
