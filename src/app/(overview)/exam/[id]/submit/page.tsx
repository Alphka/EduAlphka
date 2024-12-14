import type { HydratedDocument } from "mongoose"
import type { PageProps } from "@typings/index"
import type { IUser } from "@models/typings/User"
import { Divider, Grid, GridCol, Paper, Text, Title } from "@mantine/core"
import { notFound } from "next/navigation"
import { Exam } from "@models"
import verifyAuthorization from "@helpers/verifyAuthorization"
import connectDatabase from "@lib/connectDatabase"

export default async function SubmitExamPage({ params }: PageProps){
	await connectDatabase()

	const { id } = await params

	const [exam] = await Promise.all([
		Exam.findById(id)
			.populate<{ owner: HydratedDocument<IUser> }>("owner"),
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
						<Text fz="h5" fw={600}>Professor:</Text>
						<Text component="span" c="gray.5">{exam.owner!.name}</Text>
					</GridCol>

					{exam.subject && (
						<GridCol className="flex items-baseline gap-1">
							<Text fz="h5" fw={600}>Disciplina:</Text>
							<Text component="span" c="gray.5">{exam.subject}</Text>
						</GridCol>
					)}

					<GridCol className="flex items-baseline gap-1">
						<Text fz="h5" fw={600}>Pontuação:</Text>
						<Text component="span" c="gray.5">{exam.questions.filter(({ isRequired }) => isRequired).length}</Text>
					</GridCol>

					<GridCol className="flex items-baseline gap-1">
						<Text fz="h5" fw={600}>Data de criação do teste:</Text>
						<Text component="span" c="gray.5">{exam.createdAt.toLocaleDateString("pt-BR")}</Text>
					</GridCol>

					{exam.expiresAt && (
						<GridCol className="flex items-baseline gap-1">
							<Text fz="h5" fw={600}>Data final para a entrega do teste:</Text>
							<Text component="span" c="gray.5">{exam.expiresAt.toLocaleString("pt-BR")}</Text>
						</GridCol>
					)}
				</Grid>

				<Divider />

				<div className="flex flex-col gap-1">
					<Text fz="h5" fw={600}>Descrição:</Text>
					<Text component="span" c="gray.5" className="whitespace-pre-wrap">{exam.description}</Text>
				</div>
			</Paper>

			<div className="flex flex-col gap-lg">
				<Title
					order={2}
					fz="h3"
				>
					Questões
				</Title>

				<ul className="flex flex-col gap-md">
					{exam.questions.map((question, index) => {
						const {
							_id,
							text,
							isRequired
						} = question

						return (
							<Paper
								p="md"
								component="li"
								withBorder
								shadow="xs"
								key={_id.toString()}
							>
								<Title
									fz="h5"
									fw="bold"
									order={3}
								>
									{isRequired && (
										<Text
											c="red"
											className="float-right select-none"
											aria-label="Questão obrigatória"
											component="span"
										>
											*
										</Text>
									)}

									Questão {index + 1}
								</Title>

								<Text
									fz="lg"
									fw={500}
									component="span"
								>
									{text}
								</Text>
							</Paper>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
