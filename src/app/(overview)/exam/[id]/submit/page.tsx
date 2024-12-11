import type { PageProps } from "@typings/index"
import type { IExam } from "@models/typings/Exam"
import { Divider, Grid, GridCol, Paper, Text, Title } from "@mantine/core"
import { Exam, type User } from "@models"
import { notFound } from "next/navigation"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"

export default async function SubmitExamPage({ params }: PageProps){
	await connectDatabase()

	const { id } = await params

	const [exam] = await Promise.all([
		Exam.findById<IExam & { owner: InstanceType<typeof User> }>(id)
			.populate("owner"),
		verifyAuthorization({ accountType: "candidate" })
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

			<Paper
				className="flex flex-col gap-md"
				p="xl"
				withBorder
				shadow="xs"
			>
				<Grid
					gutter="sm"
					grow
				>
					<GridCol className="flex items-baseline gap-1">
						<Title order={2} fz="h5">Professor:</Title>
						<Text component="span" c="gray.5">{exam.owner.name}</Text>
					</GridCol>

					{exam.subject && (
						<GridCol className="flex items-baseline gap-1">
							<Title order={2} fz="h5">Disciplina:</Title>
							<Text component="span" c="gray.5">{exam.subject}</Text>
						</GridCol>
					)}

					<GridCol className="flex items-baseline gap-1">
						<Title order={2} fz="h5">Pontuação:</Title>
						<Text component="span" c="gray.5">{exam.questions.filter(({ isRequired }) => isRequired).length}</Text>
					</GridCol>

					<GridCol className="flex items-baseline gap-1">
						<Title order={2} fz="h5">Data de criação do teste:</Title>
						<Text component="span" c="gray.5">{exam.createdAt.toLocaleDateString("pt-BR")}</Text>
					</GridCol>

					{exam.expiresAt && (
						<GridCol className="flex items-baseline gap-1">
							<Title order={2} fz="h5">Data final para a entrega do teste:</Title>
							<Text component="span" c="gray.5">{exam.expiresAt.toLocaleString("pt-BR")}</Text>
						</GridCol>
					)}
				</Grid>

				<Divider />

				<div className="flex flex-col gap-1">
					<Title order={2} fz="h5">Descrição:</Title>
					<Text component="span" c="gray.5" className="whitespace-pre-wrap">{exam.description}</Text>
				</div>
			</Paper>
		</div>
	)
}
