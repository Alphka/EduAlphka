"use client"

import type { ReactNode } from "react"
import { createTheme, MantineProvider, NumberInput, Textarea, TextInput, Select, rem, Group, Badge } from "@mantine/core"
import { TimeInput } from "@mantine/dates"

interface ProviderProps {
	fontFamily: string
	children: ReactNode
}

export default function Providers({ fontFamily, children }: ProviderProps){
	const theme = createTheme({
		cursorType: "pointer",
		components: {
			Badge: Badge.extend({
				classNames: {
					root: "select-none"
				}
			}),
			Group: Group.extend({
				defaultProps: {
					wrap: "nowrap"
				}
			}),
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
		fontSizes: {
			"3xs": rem(8),
			"2xs": rem(10),
			xs: rem(12),
			sm: rem(14),
			md: rem(16),
			lg: rem(18),
			xl: rem(20),
			"1xl": rem(14),
			"2xl": rem(16),
			"3xl": rem(18),
			"4xl": rem(22),
			"5xl": rem(26),
			"6xl": rem(34)
		},
		lineHeights: {
			"3xs": "1.55",
			"2xs": "1.55",
			xs: "1.55",
			sm: "1.55",
			md: "1.55",
			lg: "1.55",
			xl: "1.55",
			"6xl": "1.3",
			"5xl": "1.35",
			"4xl": "1.4",
			"3xl": "1.45",
			"2xl": "1.5",
			"1xl": "1.5"
		},
		fontSmoothing: false,
		fontFamily: fontFamily,
		headings: {
			fontFamily: fontFamily,
			sizes: {
				h1: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-6xl)",
					lineHeight: "1.3"
				},
				h2: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-5xl)",
					lineHeight: "1.35"
				},
				h3: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-4xl)",
					lineHeight: "1.4"
				},
				h4: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-3xl)",
					lineHeight: "1.45"
				},
				h5: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-2xl)",
					lineHeight: "1.5"
				},
				h6: {
					fontWeight: "bold",
					fontSize: "var(--mantine-font-size-1xl)",
					lineHeight: "1.5"
				}
			}
		},
		spacing: {
			xs: rem(4),
			sm: rem(8),
			md: rem(12),
			lg: rem(16),
			xl: rem(20),
			"2xl": rem(24),
			"3xl": rem(32),
			"4xl": rem(40),
			"5xl": rem(48),
			"6xl": rem(64)
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
