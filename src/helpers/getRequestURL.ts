import { headers } from "next/headers"

export default async function getRequestURL(){
	const headerStore = await headers()

	let url = headerStore.get("x-url")

	if(url) return url

	url = headerStore.get("next-url")

	if(url){
		const origin = headerStore.get("origin")
		if(origin) return origin + url

		const host = headerStore.get("x-forwarded-host") || headerStore.get("host")
		if(host) return (`${headerStore.get("x-forwarded-proto") || "http"}://`) + host + url
	}
}
