import type { Locales } from "@src/i18n"
import { redirect } from "next/navigation"
import getLocale from "./getLocale"
import getToken from "./getToken"

async function verifyAuthorization(locale?: Locales): Promise<void>
async function verifyAuthorization(_locale?: Locales){
	const locale = _locale ?? await getLocale()
	const token = await getToken()

	if(!token) redirect(locale ? `/${locale}/login` : "/login")
}

export default verifyAuthorization
