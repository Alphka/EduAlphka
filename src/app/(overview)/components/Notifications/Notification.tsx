import type { ComponentPropsWithoutRef, HTMLAttributes } from "react"
import { memo } from "react"
import routes from "@app/routes"
import Link from "next/link"

type NotificationProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & Omit<HTMLAttributes<HTMLDivElement>, "ref"> & {
	handleClose: () => void
	exam?: string
}

const _Notification = memo(function Notification({ exam, handleClose, ...props }: NotificationProps){
	if(exam){
		return (
			<Link
				href={routes.exam.children.template.pathname.replace("[id]", exam)}
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
