import { NextResponse, type NextRequest } from "next/server"
import { TOKEN_KEY } from "@constants/index"
import validateToken from "@helpers/validateToken"

function getToken(request: NextRequest){
	return validateToken(request.headers.get("Authorization"))
		|| validateToken(request.cookies.get(TOKEN_KEY)?.value)
		|| null
}

export default function middleware(request: NextRequest){
	const requestHeaders = new Headers(request.headers)

	requestHeaders.set("X-Url", request.url)
	requestHeaders.set("Authorization", "Bearer " + getToken(request))

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
		"/((?!api|_logs|_src|_next/(?:static|image)|_vercel/(?:speed-)?insights/*|(?:apple-)?icon[\\w.-]?(?:\\?\\w+)?|favicon.ico|robots.txt|logout).*)"
	]
}
