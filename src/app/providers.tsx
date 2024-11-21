"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, TextInput } from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import ColorSchemeContext, { type Themes } from "./contexts/ColorScheme"

interface ProviderProps {
	children: ReactNode
	fontFamily: string
	defaultTheme: Themes
}

export default function Providers({ defaultTheme, fontFamily, children }: ProviderProps){
	const [colorScheme, setColorScheme] = useLocalStorage<Themes>({
		key: "theme",
		defaultValue: defaultTheme,
		serialize: value => value,
		deserialize: value => {
			if(value === "light" || value === "dark") return value
			return defaultTheme
		}
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
				forceColorScheme={colorScheme}
				withStaticClasses={false}
				deduplicateCssVariables
			>
				{children}
			</MantineProvider>
		</ColorSchemeContext.Provider>
	)
}
