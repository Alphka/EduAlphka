import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { ColorSchemeScript } from "@mantine/core"
import { APPLICATION_NAME } from "./constants"
import { ToastContainer } from "react-toastify"
import { twJoin } from "tailwind-merge"
import { Inter } from "next/font/google"
import Providers from "./providers"

import "react-toastify/dist/ReactToastify.css"
import "./globals.scss"

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "dark light"
}

export const metadata: Metadata = {
	title: {
		default: APPLICATION_NAME,
		template: `%s | ${APPLICATION_NAME}`
	},
	applicationName: APPLICATION_NAME,
	alternates: {
		canonical: "/"
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
		locale: "pt_BR"
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
}

const inter = Inter({
	weight: "variable",
	subsets: ["latin", "latin-ext"],
	preload: true,
	display: "swap",
	variable: "--font-inter"
})

export default function RootLayout({ children }: { children: ReactNode }){
	return (
		<html
			lang="pt-BR"
			suppressHydrationWarning
		>
			<head>
				<ColorSchemeScript />
			</head>

			<body
				className={twJoin(
					inter.variable,
					"antialiased min-h-dvh"
				)}
			>
				<Providers fontFamily={inter.style.fontFamily}>
					{children}

					<ToastContainer
						autoClose={3e3}
						pauseOnHover={false}
						pauseOnFocusLoss={false}
					/>
				</Providers>
			</body>
		</html>
	)
}
