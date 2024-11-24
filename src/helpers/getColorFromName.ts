import type { DefaultMantineColor } from "@mantine/core"

export default function getColorFromName(name: string){
	const colors = [
		"red",
		"pink",
		"grape",
		"violet",
		"indigo",
		"blue",
		"cyan",
		"green",
		"yellow",
		"orange",
		"teal"
	] satisfies DefaultMantineColor[]

	let hash = 0
	for(let i = 0; i < name.length; i++){
		hash = (hash * 31 + name.charCodeAt(i)) % 0xffffffff
	}

	return colors[Math.abs(hash) % colors.length]
}
