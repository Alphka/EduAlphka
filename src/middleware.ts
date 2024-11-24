import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, locales } from "./i18n"
import { getMiddlewareToken } from "@helpers/getToken"
import { match } from "@formatjs/intl-localematcher"
import getRouteWithLocale from "@helpers/getRouteWithLocale"
import Negotiator from "negotiator"

export default function middleware(request: NextRequest){
	const { pathname } = request.nextUrl

	const pathnameLocale = locales.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
	const pathnameWithoutLocale = pathname.slice(1).split("/").slice(1).join("/")

	if(!pathnameLocale){
		const pathnameLanguage = locales.find(locale => {
			const language = locale.split("-")[0]
			return pathname.startsWith(`/${language}/`) || pathname === `/${language}`
		})

		if(pathnameLanguage){
			return NextResponse.redirect(new URL(getRouteWithLocale(pathnameWithoutLocale, pathnameLanguage), request.nextUrl))
		}
	}

	if(!pathnameLocale){
		const pathnameLocaleInsesitive = locales.find(locale => {
			const pathnameLower = pathname.toLowerCase()
			const localeLower = locale.toLowerCase()
			const language = locale.split("-")[0]
			const languageLower = language.toLowerCase()

			return (
				pathnameLower.startsWith(`/${languageLower}/`) ||
				pathnameLower.startsWith(`/${localeLower}/`) ||
				pathnameLower === `/${languageLower}` ||
				pathnameLower === `/${localeLower}`
			)
		})

		if(typeof pathnameLocaleInsesitive === "string"){
			return NextResponse.redirect(new URL(getRouteWithLocale(pathnameWithoutLocale, pathnameLocaleInsesitive), request.nextUrl))
		}
	}

	if(!pathnameLocale){
		const negotiator = new Negotiator({ headers: Object.fromEntries(request.headers.entries()) })
		const locale = match(negotiator.languages(), locales, defaultLocale)

		return NextResponse.redirect(
			new URL(getRouteWithLocale(pathname.replace(/^(?!\/)/, "").replace(/\/$/, ""), locale), request.url),
			request.method === "GET" ? 302 : undefined
		)
	}

	const requestHeaders = new Headers(request.headers)

	requestHeaders.set("X-Url", request.url)
	requestHeaders.set("Authorization", "Bearer " + getMiddlewareToken(request))

	const response = NextResponse.next({
		request: {
			headers: requestHeaders
		}
	})

	response.headers.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme, Viewport-Width")
	response.headers.set("Referrer-Policy", "origin-when-cross-origin")
	response.headers.set("X-Frame-Options", "DENY")
	response.headers.set("X-XSS-Protection", "1; mode=block")

	return response
}

export const config = {
	matcher: [
		"/((?!api|_logs|_src|_next/(?:static|image)|_vercel/(?:speed-)?insights/*|(?:apple-)?icon[\\w.-]?(?:\\?\\w+)?|favicon.ico|robots.txt).*)"
	]
}
