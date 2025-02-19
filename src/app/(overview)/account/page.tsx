import type { Metadata } from "next"
import { Avatar, Paper } from "@mantine/core"
import { pick } from "lodash"
import PersonalInformationForm from "./components/PersonalInformationForm"
import NotificationsSettings from "./components/NotificationsSettings"
import RemoveAccountButton from "./components/RemoveAccountButton"
import verifyAuthorization from "@helpers/verifyAuthorization"
import getNameInitials from "@helpers/getNameInitials"
import routes from "@app/routes"

const title = routes.account.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function AccountPage(){
	const user = await verifyAuthorization()

	return (
		<div className="flex flex-col gap-2xl">
			<div className="flex flex-col gap-lg">
				<header className="flex justify-end flex-wrap-reverse gap-md">
					<h1 className="flex-grow text-h4 xs:text-h3 font-bold">
						Minha conta
					</h1>
				</header>
			</div>

			<Paper
				className="p-lg rounded shadow-xs"
				withBorder
			>
				<div className="flex items-center gap-xl">
					<Avatar
						className="flex-shrink-0 leading-none"
						name={user.name}
						size="xl"
						radius="100%"
						color="initials"
					>
						{getNameInitials(user.name)}
					</Avatar>

					<div>
						<p className="text-lg font-bold">
							{user.name}
						</p>
						<p className="text-dark-100 text-md font-medium">
							{user.username}
						</p>
						<p className="text-dark-200 text-md font-medium">
							{user.accountType === "professor" ? "Aplicador de testes" : "Candidato"}
						</p>
					</div>
				</div>
			</Paper>

			<PersonalInformationForm
				user={pick(user, ["name", "username", "email"] as const)}
			/>

			{
				// TODO: Remove this when professors also receive notifications
				user.accountType === "candidate" && (
					<NotificationsSettings
						settings={user.settings ?? {}}
					/>
				)
			}

			<Paper
				className="flex flex-col p-lg rounded border-error shadow-xs gap-md"
				withBorder
			>
				<header className="flex justify-between">
					<h2 className="text-h5">
						Zona de perigo
					</h2>
				</header>

				<RemoveAccountButton
					user={pick(user, ["accountType"] as const)}
				/>
			</Paper>
		</div>
	)
}
