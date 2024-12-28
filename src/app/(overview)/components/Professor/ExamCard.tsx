import type { IExam, IExamMethods } from "@models/typings/Exam"
import type { Document } from "mongoose"
import { Badge, Box, Card, Text, Title, Tooltip } from "@mantine/core"
import { MdOutlineTimer, MdPerson } from "react-icons/md"
import { twJoin } from "tailwind-merge"
import formatTimeDuration from "@helpers/formatTimeDuration"
import getHistoryMessage from "../ExamCard/helpers/getHistoryMessage"
import getStringColor from "@helpers/getStringColor"
import routes from "@app/routes"
import Link from "next/link"

interface ExamCardProps {
	exam: Document & IExam & IExamMethods
}

export default async function ExamCard({ exam }: ExamCardProps){
	const history = getHistoryMessage({
		createdAt: exam.createdAt,
		updatedAt: exam.updatedAt
	})

	const isExamExpired = exam.isExpired()

	return (
		<Link
			href={`${routes.exam.pathname}/${exam.id}`}
			className={twJoin(
				"group relative h-full rounded-md overflow-hidden shadow-xs",
				"focus:outline-none"
			)}
			prefetch={false}
		>
			<Card
				className={twJoin(
					"h-full p-lg",
					"min-h-40 md:min-h-44 lg:min-h-48"
				)}
			>
				<div
					className={twJoin(
						"absolute inset-0 pointer-events-none z-1",
						"group-hover:bg-blue-500/5",
						"group-focus-visible:bg-blue-500/10"
					)}
				/>

				<div className="h-full flex flex-col gap-md">
					<div className="flex items-start justify-between gap-md">
						<Title
							fz="2xl"
							order={2}
							title={exam.title}
							lineClamp={3}
							className="self-start"
						>
							{exam.title}
						</Title>

						<Badge
							size="md"
							variant="light"
							className="shrink-0"
							color={isExamExpired ? "yellow" : "blue"}
						>
							{isExamExpired ? "Expirado" : "Ativo"}
						</Badge>
					</div>

					<Text
						size="xs"
						c="dimmed"
						ta="justify"
						className="whitespace-pre-wrap"
						lineClamp={5}
					>
						{exam.description}
					</Text>

					<div className="flex-grow flex items-end content-end flex-wrap gap-x-md gap-y-2">
						{!!exam.subject && (
							<div className="flex-shrink-0 flex items-center gap-xs">
								<Box
									bg={`${getStringColor(exam.subject)}.5`}
									className="w-2.5 h-2.5 rounded-full"
								/>

								<p className="text-xs font-medium leading-none">
									{exam.subject}
								</p>
							</div>
						)}

						<div className="flex-grow flex items-center justify-end flex-wrap overflow-hidden gap-md">
							<div className="flex items-center gap-md">
								<Tooltip
									py="sm"
									px="md"
									fz="xs"
									label="Duração do teste"
									events={{ hover: true, focus: false, touch: true }}
									position="top"
									withArrow
								>
									<div className="flex-shrink-0 flex items-center gap-xs">
										<MdOutlineTimer className="text-sm" />

										<Text fz="xs" fw={500} lh={1}>
											{formatTimeDuration(exam.duration)}
										</Text>
									</div>
								</Tooltip>
							</div>

							<Tooltip
								py="sm"
								px="md"
								fz="xs"
								label="Número de candidatos participando do teste"
								events={{ hover: true, focus: false, touch: true }}
								position="top"
								withArrow
							>
								<div className="flex-shrink-0 flex items-center gap-xs">
									<MdPerson className="text-sm" />

									<p className="text-xs font-medium leading-none">
										{exam.candidates.length}
									</p>
								</div>
							</Tooltip>

							<Text
								fz="2xs"
								fw={400}
								lh={1}
								title={new Date(exam.updatedAt || exam.createdAt).toLocaleString("pt-BR")}
								truncate="end"
								className="text-nowrap"
							>
								{history}
							</Text>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	)
}
