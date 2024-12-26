function formatTimeDuration(minutes: number, withSeconds: true): `${number}:${number}:${number}`
function formatTimeDuration(minutes: number, withSeconds?: false): `${number}:${number}`
function formatTimeDuration(minutes: number, withSeconds = false){
	const hours = Math.floor(minutes / 60)
	const remainingMinutes = Math.floor(minutes % 60)

	const formattedHours = hours.toString().padStart(2, "0")
	const formattedMinutes = remainingMinutes.toString().padStart(2, "0")

	if(withSeconds){
		const remainingSeconds = Math.floor(minutes % 1 * 60)
		const formattedSeconds = remainingSeconds.toString().padStart(2, "0")

		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}` as const
	}

	return `${formattedHours}:${formattedMinutes}` as const
}

export default formatTimeDuration
