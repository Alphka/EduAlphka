import type { Document, HydratedDocument } from "mongoose"
import type { StartedExam } from "@models"
import type { ISubmit } from "@models/typings/Submit"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { Avatar, Badge, Box, Card, Divider, Text, Tooltip } from "@mantine/core"
import { getSubmitStatus, submitStatusColors } from "@helpers/getSubmitStatus"
import { MdOutlineQuiz, MdOutlineTimer } from "react-icons/md"
import { FaAsterisk } from "react-icons/fa"
import { twJoin } from "tailwind-merge"
import formatTimeDuration from "@helpers/formatTimeDuration"
import getHistoryMessage from "../ExamCard/helpers/getHistoryMessage"
import getStringColor from "@helpers/getStringColor"
import routes from "@app/routes"
import Link from "next/link"

interface ExamCardProps {
	pendingCorrection: boolean
	startedExam: InstanceType<typeof StartedExam> | null
	submit: ISubmit | null
	exam: Document & Omit<IExam, "owner"> & { owner: HydratedDocument<IUser> }
}

export default async function ExamCard({
	pendingCorrection,
	startedExam,
	submit,
	exam
}: ExamCardProps){
	const history = getHistoryMessage({
		createdAt: exam.createdAt,
		updatedAt: exam.updatedAt
	})

	const isExamStarted = !!startedExam
	const isExamSubmitted = !!submit
	const isExamExpired = isExamStarted && !isExamSubmitted && await startedExam.isExpired({
		exam,
		submit: isExamSubmitted
	})

	const submitStatus = getSubmitStatus({
		hasStartedExam: isExamStarted,
		hasSubmit: isExamSubmitted,
		isExpired: isExamExpired,
		pendingCorrection
	})

	return (
		<Link
			href={`${routes.exam.pathname}/${exam.id}/submit`}
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
						<div className="flex items-center gap-sm">
							<Avatar
								name={exam.owner.name}
								size="md"
								radius="xl"
								color="initials"
								className="leading-none"
							/>

							<div>
								<p className="text-sm font-medium">{exam.owner.name}</p>
								<p className="text-xs text-dark-200">{exam.owner.username}</p>
							</div>
						</div>

						<Badge
							size="md"
							variant="light"
							className="shrink-0"
							color={submitStatusColors[submitStatus]}
						>
							{submitStatus}
						</Badge>
					</div>

					<Divider />

					<Text
						fz="2xl"
						fw="bold"
						title={exam.title}
						truncate="end"
						component="h2"
					>
						{exam.title}
					</Text>

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

								<Text
									fz="xs"
									fw={500}
									lh={1}
								>
									{exam.subject}
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

										<p className="text-xs font-medium leading-none">
											{formatTimeDuration(exam.duration)}
										</p>
									</div>
								</Tooltip>
							</div>

							<Tooltip
								py="sm"
								px="md"
								fz="xs"
								label="Quantidade de questões do teste"
								events={{ hover: true, focus: false, touch: true }}
								position="top"
								withArrow
							>
								<div className="flex-shrink-0 flex items-center gap-xs">
									<MdOutlineQuiz className="text-sm" />

									<p className="text-xs font-medium leading-none">
										{exam.questions.length}
									</p>
								</div>
							</Tooltip>

							<Tooltip
								py="sm"
								px="md"
								fz="xs"
								label="Quantidade de questões obrigatórias do teste"
								events={{ hover: true, focus: false, touch: true }}
								position="top"
								withArrow
							>
								<div className="flex-shrink-0 flex items-center gap-xs">
									<FaAsterisk className="text-sm" />

									<p className="text-xs font-medium leading-none">
										{exam.questions.length}
									</p>
								</div>
							</Tooltip>

							<Text
								fz="2xs"
								fw={400}
								lh={1}
								title={new Date(exam.updatedAt || exam.createdAt).toLocaleString("pt-BR")}
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

// TODO: Add remaining time to submit test
