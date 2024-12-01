import type { Config } from "tailwindcss"
import { DEFAULT_THEME } from "@mantine/core"
import tailwindPresetMantine from "tailwind-preset-mantine"

const config: Config = {
	content: [
		"./src/**/*.tsx"
	],
	theme: {
		extend: {
			fontSize: {
				xs: ["var(--mantine-font-size-xs)", {
					lineHeight: "1.55"
				}],
				sm: ["var(--mantine-font-size-sm)", {
					lineHeight: "1.55"
				}],
				md: ["var(--mantine-font-size-md)", {
					lineHeight: "1.55"
				}],
				lg: ["var(--mantine-font-size-lg)", {
					lineHeight: "1.55"
				}],
				xl: ["var(--mantine-font-size-xl)", {
					lineHeight: "1.55"
				}],
				"6xl": ["var(--mantine-h1-font-size)", {
					lineHeight: "1.3"
				}],
				"5xl": ["var(--mantine-h2-font-size)", {
					lineHeight: "1.35"
				}],
				"4xl": ["var(--mantine-h3-font-size)", {
					lineHeight: "1.4"
				}],
				"3xl": ["var(--mantine-h4-font-size)", {
					lineHeight: "1.45"
				}],
				"2xl": ["var(--mantine-h5-font-size)", {
					lineHeight: "1.5"
				}],
				"1xl": ["var(--mantine-h6-font-size)", {
					lineHeight: "1.5"
				}],
				DEFAULT: ["var(--mantine-font-size-md)", {
					lineHeight: "1.55"
				}]
			}
		}
	},
	presets: [
		tailwindPresetMantine({
			mantineBreakpoints: DEFAULT_THEME.breakpoints,
			mantineColors: DEFAULT_THEME.colors
		})
	],
	darkMode: ["selector", '[data-mantine-color-scheme="dark"]']
}

export default config
