import type { ComponentPropsWithoutRef, HTMLAttributes } from "react"
import type { IUser } from "@models/typings/User"
import { memo } from "react"
import routes from "@app/routes"
import Link from "next/link"

type NotificationProps =
	& Omit<ComponentPropsWithoutRef<typeof Link>, "href">
	& Omit<HTMLAttributes<HTMLDivElement>, "ref">
	& Pick<IUser, "accountType">
	& {
	handleClose: () => void
	exam?: string
}

const _Notification = memo(function Notification({ accountType, exam, handleClose, ...props }: NotificationProps){
	if(exam){
		const examUrl = accountType === "professor"
			? routes.exam.children.template.pathname.replace("[id]", exam)
			: routes.exam.children.template.children.submit.pathname.replace("[id]", exam)

		return (
			<Link
				href={examUrl}
				aria-label="Ir para a página do teste"
				prefetch={false}
				{...props}
				onClick={event => {
					handleClose()
					props.onClick?.(event)
				}}
			/>
		)
	}

	return <div {...props} />
})

export default _Notification
