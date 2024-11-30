export default function formatTimeDuration(minutes: number){
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = Math.floor(minutes % 60)
    const seconds = Math.round((minutes % 1) * 60)

    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = remainingMinutes.toString().padStart(2, "0")
    const formattedSeconds = seconds.toString().padStart(2, "0")

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}` as const
}
