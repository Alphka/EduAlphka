import { Paper } from "@mantine/core"
import { useId } from "react"
import ManageInviteURL from "./components/ManageInviteURL"
import getRequestURL from "@helpers/getRequestURL"
import routes from "@app/routes"

export interface ExamInvitationProps {
	examId: string
	inviteToken: string | undefined
}

export default async function ExamInvitation({ examId, inviteToken }: ExamInvitationProps){
	const id = useId()
	const url = (await getRequestURL())!

	return (
		<Paper
			className="flex flex-col p-xl gap-lg"
			withBorder
		>
			<section
				className="flex flex-col text-md gap-md"
				aria-labelledby={id}
			>
				<header>
					<h2 id={id} className="text-h5">
						Link de convite do teste
					</h2>
				</header>

				<ManageInviteURL
					examId={examId}
					inviteURL={inviteToken ? new URL(routes.invite.children.template.pathname.replace("[token]", inviteToken), url).href : undefined}
				/>
			</section>
		</Paper>
	)
}
