import type { NextConfig } from "next"
import routes from "@app/routes"

const nextConfig: NextConfig = {
	productionBrowserSourceMaps: true,
	reactStrictMode: false,
	poweredByHeader: false,
	logging: {
		fetches: {
			fullUrl: true,
			hmrRefreshes: true
		}
	},
	async redirects(){
		const redirects = Object.values(routes).map(route => {
			if(!("redirect" in route)) return

			return {
				source: route.pathname,
				destination: route.redirect,
				permanent: true
			} satisfies Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number]
		})

		return redirects.filter(Boolean) as (NonNullable<typeof redirects[number]>)[]
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
			dynamic: 120,
			static: 300
		}
	},
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"]
	}
}

export default nextConfig
