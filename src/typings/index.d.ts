import type { Locales } from "@src/i18n"

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string
			HASH_SALT?: string
			MONGODB_URI?: string
		}
	}
}

export interface PageProps {
	params: Promise<Record<string, string>>
	searchParams: Promise<{
		[key: string]: string | string[] | undefined
	}>
}

export interface PagePropsWithLocale extends PageProps {
	params: Promise<{
		locale: Locales
	}>
}
