"use client"

import type { IUser } from "@models/typings/User"
import { useEffect, useId, useState } from "react"
import { useSet } from "@mantine/hooks"
import { Paper } from "@mantine/core"
import { toast } from "react-toastify"
import SettingSwitch from "./SettingSwitch"

interface NotificationSettingsProps extends Required<Pick<IUser, "settings">> {}

export default function NotificationsSettings({ settings }: NotificationSettingsProps){
	const [toastPromise, setToastPromise] = useState<{ resolve: () => void } | undefined>()
	const [toastOpened, setToastOpened] = useState(false)
	const promises = useSet<string>()
	const toastId = useId()

	useEffect(() => {
		if(toastOpened){
			if(promises.size) return

			toastPromise!.resolve()

			setToastOpened(false)
			setToastPromise(undefined)

			return
		}

		if(!promises.size) return

		setToastOpened(true)

		const promise = new Promise<void>((resolve) => {
			setToastPromise({ resolve })
		})

		toast.promise(promise, {
			pending: "Salvando alterações...",
			success: "Alterações salvas com sucesso!",
			error: "Algo deu errado ao salvar as alterações"
		}, { toastId })
	}, [promises.size])

	return (
		<Paper
			className="flex flex-col p-lg rounded shadow-xs gap-md"
			withBorder
		>
			<header className="flex justify-between">
				<h2 className="text-h5">
					Configurações das notificações por e-mail
				</h2>
			</header>

			<div className="flex flex-col gap-sm">
				<SettingSwitch
					name="notifyExamCorrection"
					label="Notificar quando uma correção de teste for finalizada"
					promises={promises}
					defaultChecked={settings.notifyExamCorrection}
				/>
			</div>
		</Paper>
	)
}
