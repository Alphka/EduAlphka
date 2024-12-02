import { isFinite } from "lodash"

export default function getDurationMinutes(duration: string){
	const parts = duration.split(":", 3)

	parts.length = 3

	const [hours, minutes, seconds] = Array.from(parts, time => {
		if(!time) return 0
		const number = Number(time)
		return isFinite(number) && number > 0 && number || 0
	})

	return hours * 60 + minutes + seconds / 60
}
