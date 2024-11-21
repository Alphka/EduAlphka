export type Locales = typeof locales[number]

export const locales = ["pt", "en"] as const satisfies string[]
export const defaultLocale = "pt" satisfies Locales
