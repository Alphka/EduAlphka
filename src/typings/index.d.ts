declare global {
	var baseURL: URL

	namespace NodeJS {
		interface ProcessEnv {
			PORT?: string
			HASH_SALT?: string
			MONGODB_URI?: string
			DATABASE_NAME?: string

			EMAIL?: string
			EMAIL_PASSWORD?: string
		}
	}
}

export interface PageProps {
	params: Promise<Record<string, string>>
	searchParams: Promise<{
		[key: string]: string | string[] | undefined
	}>
}
