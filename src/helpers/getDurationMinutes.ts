import { isFinite } from "lodash"

export default function getDurationMinutes(duration: string){
	const parts = duration.split(":", 2)

	parts.length = 2

	const [hours, minutes] = Array.from(parts, time => {
		if(!time) return 0
		const number = Number(time)
		return isFinite(number) && number > 0 && number || 0
	})

	return hours * 60 + minutes
}
