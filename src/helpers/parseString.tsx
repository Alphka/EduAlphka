import type { ReactNode } from "react"

const tags = [
	"b",
	"i",
	"u"
] as const

const regex = new RegExp(`<(${tags.join("|")})>([\\w\\W]*?)</\\1>`, "g")

export default function parseString(string: string): ReactNode[] {
	string = string.trim()

	const parts: ReactNode[] = []

	let match: RegExpExecArray | null
	let lastIndex = 0

	while((match = regex.exec(string))){
		const Tag = match[1] as typeof tags[number]

		parts.push(
			string.substring(lastIndex, match.index),
			<Tag key={match.index}>{match[2]}</Tag>
		)

		lastIndex = regex.lastIndex
	}

	parts.push(string.substring(lastIndex))

	return parts.filter(Boolean)
}
