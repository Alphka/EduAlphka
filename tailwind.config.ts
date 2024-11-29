import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./src/**/*.tsx"
	],
	darkMode: ["selector", '[data-mantine-color-scheme="dark"]']
}

export default config
