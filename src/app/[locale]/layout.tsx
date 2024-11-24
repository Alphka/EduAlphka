import type { PagePropsWithLocale } from "@typings/index"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { ColorSchemeScript } from "@mantine/core"
import { APPLICATION_NAME } from "@constants"
import { ToastContainer } from "react-toastify"
import { defaultTheme } from "@contexts/ColorScheme"
import { getLanguage } from "./dictionaries"
import { locales } from "@src/i18n"
import { headers } from "next/headers"
import { twJoin } from "tailwind-merge"
import { Inter } from "next/font/google"
import getRouteWithLocale from "@helpers/getRouteWithLocale"
import Providers from "../providers"
import routes from "@app/routes"

import "react-toastify/dist/ReactToastify.css"
import "./globals.scss"

export interface RootLayoutProps extends Omit<PagePropsWithLocale, "searchParams"> {
	children: ReactNode
}

const inter = Inter({
	weight: "variable",
	subsets: ["latin", "latin-ext"],
	preload: true,
	display: "swap",
	variable: "--font-inter"
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "dark light"
}

export async function generateMetadata({ params }: RootLayoutProps){
	const { locale } = await params
	const localesSet = new Set(locales)

	localesSet.delete(locale)

	return {
		title: {
			default: APPLICATION_NAME,
			template: `%s | ${APPLICATION_NAME}`
		},
		applicationName: APPLICATION_NAME,
		alternates: {
			canonical: "/",
			languages: {
				...Object.fromEntries(locales.map(locale => [locale, getRouteWithLocale(routes.homepage.pathname, locale)]))
			}
		},
		robots: {
			index: true,
			follow: true,
			nocache: false,
			noimageindex: false
		},
		openGraph: {
			title: APPLICATION_NAME,
			siteName: APPLICATION_NAME,
			url: "/",
			type: "website",
			locale,
			alternateLocale: Array.from(localesSet)
		},
		keywords: [
			"alphka",
			"education",
			"provas",
			"testes",
			"exames",
			"plataforma",
			"online",
			"database",
			"nosql",
			"crud"
		],
		creator: "Kayo Souza"
	} as Metadata
}

export async function generateStaticParams(){
	return locales.map(locale => ({ locale }))
}

export default async function RootLayout({ params, children }: RootLayoutProps){
	const { locale } = await params
	const headersStore = await headers()
	const language = getLanguage(locale)

	const colorScheme = (() => {
		const value = headersStore.get("sec-ch-prefers-color-scheme")
		return value === "dark" || value === "light" ? value : defaultTheme
	})()

	return (
		<html
			lang={language}
			data-mantine-color-scheme={colorScheme}
			suppressHydrationWarning
		>
			<head>
				<ColorSchemeScript localStorageKey="theme" />
			</head>

			<body
				className={twJoin(
					inter.variable,
					"antialiased min-h-dvh"
				)}
			>
				<Providers
					fontFamily={inter.style.fontFamily}
					defaultTheme={colorScheme}
				>
					{children}

					<ToastContainer
						autoClose={5e3}
						pauseOnHover={false}
						pauseOnFocusLoss={false}
					/>
				</Providers>
			</body>
		</html>
	)
}
