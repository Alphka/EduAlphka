"use client"

import type { IStartedExam } from "@models/typings/StartedExam"
import type { IExam } from "@models/typings/Exam"
import { useCallback, useId, useState } from "react"
import { useInterval } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import { twJoin } from "tailwind-merge"
import { toast } from "react-toastify"
import { Paper } from "@mantine/core"
import formatTimeDuration from "@helpers/formatTimeDuration"
import routes from "@app/routes"

const criticalMinutesRemaining = 5

interface RemainingTimeProps {
	exam: Pick<IExam, "duration" | "expiresAt"> & {
		id: string
		startedAt: IStartedExam["createdAt"]
	}
}

export default function RemainingTime({ exam }: RemainingTimeProps){
	const getRemainingMinutes = useCallback(() => {
		const remainingMinutes = exam.duration - (Date.now() - exam.startedAt.getTime()) / 1000 / 60
		return remainingMinutes < 0 ? 0 : remainingMinutes
	}, [exam.duration, exam.startedAt.getTime()])

	const getRemainingTime = useCallback((remainingMinutes: number) => ({
		hours: Math.floor(remainingMinutes / 60),
		minutes: Math.floor(remainingMinutes % 60),
		seconds: Math.floor(remainingMinutes % 1 * 60),
		string: formatTimeDuration(remainingMinutes, true)
	}), [])

	const [remainingTime, setRemainingTime] = useState(() => getRemainingTime(getRemainingMinutes()))
	const [isCriticalTimeRemaining, setIsCriticalTimeRemaining] = useState(() => (
		remainingTime.hours === 0 &&
		(remainingTime.minutes === criticalMinutesRemaining && remainingTime.seconds === 0) ||
		remainingTime.minutes < criticalMinutesRemaining
	))
	const remainingTimeToastId = useId()
	const router = useRouter()

	const { stop: stopTimer } = useInterval(() => {
		const remainingMinutes = getRemainingMinutes()
		const remainingTime = getRemainingTime(remainingMinutes)

		if(
			!isCriticalTimeRemaining &&
			remainingTime.hours === 0 &&
			((remainingTime.minutes === criticalMinutesRemaining && remainingTime.seconds === 0) || remainingTime.minutes < criticalMinutesRemaining)
		){
			toast.warn(`Faltam ${remainingTime.minutes === criticalMinutesRemaining ? criticalMinutesRemaining : `menos de ${criticalMinutesRemaining}`} minutos para o fim do teste!`, {
				toastId: remainingTimeToastId,
				position: "bottom-right"
			})

			setIsCriticalTimeRemaining(true)
		}

		setRemainingTime(remainingTime)

		if(remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0){
			stopTimer()

			toast.dismiss(remainingTimeToastId)
			toast.warn("O seu teste expirou!")

			router.push(routes.homepage.pathname)
		}
	}, 1000, { autoInvoke: true })

	return (
		<Paper
			className={twJoin(
				"leading-none px-sm py-xs shadow-xs",
				isCriticalTimeRemaining && "bg-red-light text-red-light-color border-red-light-hover"
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
