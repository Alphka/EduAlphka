import { defaultLocale } from "@src/i18n"
import "server-only"

const dictionaries = {
	["pt-BR"]: () => import("@src/dictionaries/pt-BR").then(module => module.default),
	["en-US"]: () => import("@src/dictionaries/en-US").then(module => module.default)
}

export type Dictionaries = typeof dictionaries
export type Dictionary<T extends keyof Dictionaries = keyof Dictionaries> = Awaited<ReturnType<Dictionaries[T]>>

export function getLanguage(locale?: string){
	if(locale && locale in dictionaries) return locale as keyof typeof dictionaries
	return defaultLocale || "pt-BR"
}

export async function getDictionary(locale: string){
	return dictionaries[getLanguage(locale)]()
}
