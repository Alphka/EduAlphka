import { defaultLocale } from "@src/i18n"

const dictionaries = {
	["pt"]: () => import("@src/dictionaries/pt").then(module => module.default),
	["en"]: () => import("@src/dictionaries/en").then(module => module.default)
}

export type Dictionaries = typeof dictionaries
export type Dictionary<T extends keyof Dictionaries = keyof Dictionaries> = Awaited<ReturnType<Dictionaries[T]>>

export function getLanguage(locale?: string){
	if(locale && locale in dictionaries) return locale as keyof typeof dictionaries
	return defaultLocale
}

export async function getDictionary(locale: string){
	return dictionaries[getLanguage(locale)]()
}
