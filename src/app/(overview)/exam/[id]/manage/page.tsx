import type { PageProps } from "@typings/index"
import type { Metadata } from "next"
import { Divider, Title } from "@mantine/core"
import { notFound } from "next/navigation"
import { Exam } from "@models"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"
import CandidatesTable from "./components/CandidatesTable"
import routes from "@app/routes"

const title = routes.exam.children.template.children.manage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function ManageExamPage({ params }: PageProps){
	await connectDatabase()

	const { id } = await params

	const [exam] = await Promise.all([
		Exam.findById(id).lean(),
		verifyAuthorization({ accountType: "professor" })
	])

	if(!exam) notFound()

	return (
		<div className="flex flex-col gap-3xl">
			<header>
				<Title order={1} fz="4xl">
					{exam.title || "Teste sem nome"}
				</Title>
			</header>

			<Divider />

			<CandidatesTable
				data={[
					{
						name: "Alice Codewriter",
						email: "alice.writer@gmail.com",
						username: "alicew",
						startedAt: "07/12/2024",
						pendingCorrection: false,
						answered: true,
						expired: false
					},
					{
						name: "Bob Builder",
						email: "bob.builder@gmail.com",
						username: "bobb",
						startedAt: "08/12/2024",
						pendingCorrection: true,
						answered: true,
						expired: false
					},
					{
						name: "Cathy Debugger",
						email: "cathy.debug@gmail.com",
						username: "cathydb",
						startedAt: "09/12/2024",
						pendingCorrection: false,
						answered: false,
						expired: true
					},
					{
						name: "David Scriptlover",
						email: "david.script@gmail.com",
						username: "davids",
						startedAt: "06/12/2024",
						pendingCorrection: false,
						answered: false,
						expired: false
					},
					{
						name: "Ella Errorfinder",
						email: "ella.error@gmail.com",
						username: "ellae",
						startedAt: "07/12/2024",
						pendingCorrection: false,
						answered: true,
						expired: false
					},
					{
						name: "Frank Codebreaker",
						email: "frank.breaker@gmail.com",
						username: "frankc",
						startedAt: "10/12/2024",
						pendingCorrection: false,
						answered: false,
						expired: true
					},
					{
						name: "Grace Debugqueen",
						email: "grace.queen@gmail.com",
						username: "gracedq",
						startedAt: "08/12/2024",
						pendingCorrection: true,
						answered: true,
						expired: false
					},
					{
						name: "Henry Scriptking",
						email: "henry.king@gmail.com",
						username: "henrysk",
						startedAt: "06/12/2024",
						pendingCorrection: false,
						answered: true,
						expired: false
					},
					{
						name: "Ivy Algorithm",
						email: "ivy.algo@gmail.com",
						username: "ivya",
						startedAt: "05/12/2024",
						pendingCorrection: false,
						answered: false,
						expired: true
					},
					{
						name: "Jack Loopmaster",
						email: "jack.loop@gmail.com",
						username: "jacklm",
						startedAt: "09/12/2024",
						pendingCorrection: true,
						answered: false,
						expired: false
					},
					{
						name: "Karen Scriptgenius",
						email: "karen.genius@gmail.com",
						username: "karensg",
						startedAt: "07/12/2024",
						pendingCorrection: false,
						answered: true,
						expired: false
					},
					{
						name: "Leo Bytecoder",
						email: "leo.byte@gmail.com",
						username: "leobc",
						startedAt: "08/12/2024",
						pendingCorrection: true,
						answered: true,
						expired: false
					}
				]}
			/>
		</div>
	)
}
