import type { Config } from "tailwindcss"
import { DEFAULT_THEME } from "@mantine/core"
import tailwindPresetMantine from "tailwind-preset-mantine"

const config: Config = {
	content: [
		"./src/**/*.tsx"
	],
	presets: [
		tailwindPresetMantine({
			mantineBreakpoints: DEFAULT_THEME.breakpoints,
			mantineColors: DEFAULT_THEME.colors
		})
	],
	darkMode: "media"
}

export default config
