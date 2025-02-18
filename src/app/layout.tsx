import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { ColorSchemeScript } from "@mantine/core"
import { APPLICATION_NAME } from "@constants"
import { ToastContainer } from "react-toastify"
import { twJoin } from "tailwind-merge"
import { Inter } from "next/font/google"
import Providers from "./providers"

import "react-toastify/dist/ReactToastify.css"
import "./globals.scss"

export interface RootLayoutProps {
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
	colorScheme: "only dark" as unknown as Viewport["colorScheme"]
}

global.baseURL = new URL("https://edu-alphka.vercel.app")

export const metadata: Metadata = {
	title: {
		default: APPLICATION_NAME,
		template: `%s | ${APPLICATION_NAME}`
	},
	applicationName: APPLICATION_NAME,
	alternates: {
		canonical: "/"
	},
	other: {
		"apple-mobile-web-app-title": APPLICATION_NAME,
		"darkreader-lock": "true"
	},
	robots: {
		index: true,
		follow: true
	},
	openGraph: {
		url: "/",
		type: "website",
		title: APPLICATION_NAME,
		siteName: APPLICATION_NAME
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
	creator: "Kayo Souza",
	referrer: "origin-when-cross-origin"
}

export default function RootLayout({ children }: RootLayoutProps){
	return (
		<html
			lang="pt-BR"
			data-mantine-color-scheme="dark"
			suppressHydrationWarning
		>
			<head>
				<ColorSchemeScript forceColorScheme="dark" />
			</head>

			<body
				className={twJoin(
					inter.variable,
					inter.className,
					"bg-dark text-md antialiased min-h-dvh"
				)}
				suppressHydrationWarning
			>
				<Providers fontFamily={inter.style.fontFamily}>
					{children}

					<ToastContainer
						theme="dark"
						autoClose={5e3}
						pauseOnHover={false}
						pauseOnFocusLoss={false}
					/>
				</Providers>
			</body>
		</html>
	)
}
