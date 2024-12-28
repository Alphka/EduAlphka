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
				"3xs": ["var(--mantine-font-size-3xs)", {
					lineHeight: "1.55"
				}],
				"2xs": ["var(--mantine-font-size-2xs)", {
					lineHeight: "1.55"
				}],
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
				"6xl": ["var(--mantine-font-size-6xl)", {
					lineHeight: "1.5"
				}],
				"5xl": ["var(--mantine-font-size-5xl)", {
					lineHeight: "1.5"
				}],
				"4xl": ["var(--mantine-font-size-4xl)", {
					lineHeight: "1.45"
				}],
				"3xl": ["var(--mantine-font-size-3xl)", {
					lineHeight: "1.4"
				}],
				"2xl": ["var(--mantine-font-size-2xl)", {
					lineHeight: "1.35"
				}],
				"1xl": ["var(--mantine-font-size-1xl)", {
					lineHeight: "1.3"
				}],
				"h1": ["var(--mantine-font-size-6xl)", {
					fontWeight: "bold",
					lineHeight: "1.3"
				}],
				"h2": ["var(--mantine-font-size-5xl)", {
					fontWeight: "bold",
					lineHeight: "1.35"
				}],
				"h3": ["var(--mantine-font-size-4xl)", {
					fontWeight: "bold",
					lineHeight: "1.4"
				}],
				"h4": ["var(--mantine-font-size-3xl)", {
					fontWeight: "bold",
					lineHeight: "1.45"
				}],
				"h5": ["var(--mantine-font-size-2xl)", {
					fontWeight: "bold",
					lineHeight: "1.5"
				}],
				"h6": ["var(--mantine-font-size-1xl)", {
					fontWeight: "bold",
					lineHeight: "1.55"
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
			zIndex: {
				1: "1",
				2: "2",
				3: "3",
				4: "4",
				5: "5",
				6: "6",
				7: "7",
				8: "8",
				9: "9",
				10: "10"
			}
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
