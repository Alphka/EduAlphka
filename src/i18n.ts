export type Locales = typeof locales[number]

export const locales = ["pt-BR", "en-US"] as const
export const defaultLocale = "pt-BR" satisfies Locales
