import type { IExam } from "@models/typings/Exam"
import type { Types } from "mongoose"
import type formatTimeDuration from "@helpers/formatTimeDuration"
import { Badge, Box, Card, Text, Tooltip } from "@mantine/core"
import { MdOutlineTimer, MdPerson } from "react-icons/md"
import { twJoin } from "tailwind-merge"
import getHistoryMessage, { type HistoryMessageProps } from "./helpers/getHistoryMessage"
import getStringColor from "@helpers/getStringColor"
import Link from "next/link"

interface ExamCardProps extends Pick<IExam, "title" | "subject" | "description">, HistoryMessageProps {
	candidatesCount: number
	duration: ReturnType<typeof formatTimeDuration>
	active: boolean
	examId: string | Types.ObjectId
}

export default function ExamCard({
	title,
	active,
	examId,
	subject,
	duration,
	createdAt,
	updatedAt,
	description,
	candidatesCount
}: ExamCardProps){
	const history = getHistoryMessage({ createdAt, updatedAt })

	return (
		<Link
			href={`/exam/${examId}`}
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
						"absolute inset-0 pointer-events-none z-[1]",
						"group-hover:bg-blue-500/5",
						"group-focus-visible:bg-blue-500/10"
					)}
				/>

				<div className="h-full flex flex-col gap-md">
					<div className="flex items-start justify-between gap-md">
						<Text
							fz="2xl"
							fw="bold"
							title={title}
							truncate="end"
							component="h2"
						>
							{title}
						</Text>

						<Badge
							size="md"
							variant="light"
							className="shrink-0"
							color={active ? "blue" : "yellow"}
						>
							{active ? "Ativo" : "Expirado"}
						</Badge>
					</div>

					<Text
						size="xs"
						c="dimmed"
						ta="justify"
						className="whitespace-pre-wrap"
						lineClamp={5}
					>
						{description}
					</Text>

					<div className="flex-grow flex items-end content-end flex-wrap gap-x-md gap-y-2">
						{!!subject && (
							<div className="flex-shrink-0 flex items-center gap-xs">
								<Box
									bg={`${getStringColor(subject)}.5`}
									className="w-2.5 h-2.5 rounded-full"
								/>

								<Text
									fz="xs"
									fw={500}
									lh={1}
								>
									{subject}
								</Text>
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
											{duration}
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

									<Text fz="xs" fw={500} lh={1}>
										{candidatesCount}
									</Text>
								</div>
							</Tooltip>

							<Text
								fz="2xs"
								fw={400}
								lh={1}
								title={new Date(updatedAt || createdAt).toLocaleString("pt-BR")}
								className="text-nowrap"
								truncate="end"
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

export { default as ExamCardSkeleton } from "./Skeleton"
