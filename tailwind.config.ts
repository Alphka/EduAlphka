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
				"1xl": ["var(--mantine-font-size-6xl)", {
					lineHeight: "1.5"
				}],
				"2xl": ["var(--mantine-font-size-5xl)", {
					lineHeight: "1.5"
				}],
				"3xl": ["var(--mantine-font-size-4xl)", {
					lineHeight: "1.45"
				}],
				"4xl": ["var(--mantine-font-size-3xl)", {
					lineHeight: "1.4"
				}],
				"5xl": ["var(--mantine-font-size-2xl)", {
					lineHeight: "1.35"
				}],
				"6xl": ["var(--mantine-font-size-1xl)", {
					lineHeight: "1.3"
				}],
				DEFAULT: ["var(--mantine-font-size-md)", {
					lineHeight: "1.55"
				}]
			},
			spacing: {
				"2xl": "1.5rem",
				"3xl": "2rem",
				"4xl": "2.5rem",
				"5xl": "3rem",
				"6xl": "4rem"
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
