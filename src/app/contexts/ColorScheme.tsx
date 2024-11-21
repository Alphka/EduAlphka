"use client"

import { createContext } from "react"

export type Themes = "dark" | "light"

export const defaultTheme = "dark" satisfies Themes

const ColorSchemeContext = createContext<{
	colorScheme: Themes
	onChange: (theme: Themes) => any
}>({
	colorScheme: defaultTheme,
	onChange: () => {}
})

export default ColorSchemeContext
