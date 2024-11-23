/** @type {import("postcss-load-config").Config} */
const config = {
	plugins: {
		"postcss-import": {},
		"postcss-preset-mantine": {},
		autoprefixer: {},
		"tailwindcss/nesting": {},
		tailwindcss: {}
	}
}

export default config
