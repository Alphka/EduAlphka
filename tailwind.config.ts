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
			},
		},
		screens: {
			xs: "36em",
			"max-xs": { raw: "not all and (min-width: 36em)" },
			sm: "48em",
			"max-sm": { raw: "not all and (min-width: 48em)" },
			md: "62em",
			"max-md": { raw: "not all and (min-width: 62em)" },
			lg: "75em",
			"max-lg": { raw: "not all and (min-width: 75em)" },
			xl: "88em",
			"max-xl": { raw: "not all and (min-width: 88em)" }
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
