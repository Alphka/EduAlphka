import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	logging: {
		fetches: {
			fullUrl: true,
			hmrRefreshes: true
		}
	},
	async headers(){
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff"
					}
				]
			}
		]
	},
	experimental: {
		optimizePackageImports: [
			"@mantine/core",
			"@mantine/hooks"
		],
		staleTimes: {
			dynamic: 5
		}
	},
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"]
	},
	typescript: {
		ignoreBuildErrors: true
	}
}

export default nextConfig
