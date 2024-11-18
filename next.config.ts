import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
	},
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"]
	}
}

export default nextConfig
