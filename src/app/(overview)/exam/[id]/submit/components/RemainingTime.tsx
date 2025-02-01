"use client"

import { useCallback, useState } from "react"
import { useInterval } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { toast } from "react-toastify"
import { Paper } from "@mantine/core"
import revalidateSubmitCache from "../actions/revalidateSubmitCache"
import formatTimeDuration from "@helpers/formatTimeDuration"
import routes from "@app/routes"

const criticalMinutesRemaining = 5

interface RemainingTimeProps {
	examId: string
	createdAt: Date
	examDuration: number
}

export default function RemainingTime({ examId, examDuration, createdAt }: RemainingTimeProps){
	const router = useRouter()

	const getRemainingMinutes = useCallback(() => {
		const remainingMinutes = examDuration - (Date.now() - createdAt.getTime()) / 1000 / 60
		return remainingMinutes < 0 ? 0 : remainingMinutes
	}, [examDuration, createdAt.getTime()])

	const getRemainingTime = useCallback((remainingMinutes: number) => ({
		hours: Math.floor(remainingMinutes / 60),
		minutes: Math.floor(remainingMinutes % 60),
		seconds: Math.floor(remainingMinutes % 1 * 60),
		string: formatTimeDuration(remainingMinutes, true)
	}), [])

	const [remainingTime, setRemainingTime] = useState(() => {
		const remainingMinutes = getRemainingMinutes()
		return getRemainingTime(remainingMinutes)
	})

	const { stop: stopTimer } = useInterval(() => {
		const remainingMinutes = getRemainingMinutes()
		const remainingTime = getRemainingTime(remainingMinutes)

		setRemainingTime(remainingTime)

		if(remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0){
			stopTimer()
			toast.warn("O seu teste expirou!")
			revalidateSubmitCache(examId)
			router.push(routes.homepage.pathname)
		}
	}, 1000, { autoInvoke: true })

	return (
		<Paper
			className={twJoin(
				"leading-none px-sm py-xs shadow-xs",
				remainingTime.hours === 0 && (
					remainingTime.minutes === criticalMinutesRemaining && remainingTime.seconds === 0 ||
					remainingTime.minutes <= criticalMinutesRemaining - 1
				) && "bg-red-light text-red-light-color border-red-light-hover"
			)}
			withBorder
		>
			<span>Tempo restante: </span>
			<span
				role="timer"
				aria-live="off"
				suppressHydrationWarning
			>
				{remainingTime.string}
			</span>
		</Paper>
	)
}
