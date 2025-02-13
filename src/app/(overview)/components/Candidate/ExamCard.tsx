import type { HTMLAttributes } from "react"
import type { ExamListProps } from "./ExamList"
import { Avatar, Badge, Box, Card, Divider, Text, Title, Tooltip } from "@mantine/core"
import { getSubmitStatus, SubmitStatus, submitStatusColors } from "@helpers/getSubmitStatus"
import { MdOutlineQuiz, MdOutlineTimer } from "react-icons/md"
import { StartedExam } from "@models"
import { FaAsterisk } from "react-icons/fa"
import { twJoin } from "tailwind-merge"
import formatTimeDuration from "@helpers/formatTimeDuration"
import getHistoryMessage from "../ExamCard/helpers/getHistoryMessage"
import getNameInitials from "@helpers/getNameInitials"
import getStringColor from "@helpers/getStringColor"
import routes from "@app/routes"
import Link from "next/link"

interface ExamCardProps {
	userId: string
	exam: ExamListProps["exams"][number]
}

export default async function ExamCard({ exam, userId }: ExamCardProps){
	const startedExam = await exam.getSubmitData(userId)

	const history = getHistoryMessage(exam)

	const isExamStarted = !!startedExam
	const isExamSubmitted = !!startedExam?.submit
	const isExamExpired = isExamStarted
		? !isExamSubmitted && await StartedExam.hydrate(startedExam).isExpired()
		: exam.isExpired()
	const pendingCorrection = !!startedExam?.pendingCorrection

	const submitStatus = getSubmitStatus({
		hasStartedExam: isExamStarted,
		hasSubmit: isExamSubmitted,
		isExpired: isExamExpired,
		pendingCorrection
	})

	const Container = (props: HTMLAttributes<HTMLElement>) => {
		return isExamExpired ? (
			<div {...props} />
		) : (
			<Link
				href={`${routes.exam.pathname}/${exam.id}/submit`}
				prefetch={false}
				{...props}
			/>
		)
	}

	const requiredQuestions = exam.questions.filter(({ isRequired }) => isRequired)
	const maxGrade = requiredQuestions.length

	return (
		<Container
			className={twJoin(
				"group relative h-full rounded-md overflow-hidden shadow-xs",
				!isExamExpired && "focus:outline-none"
			)}
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
						!isExamExpired && [
							"group-hover:bg-blue-500/5",
							"group-focus-visible:bg-blue-500/10"
						]
					)}
				/>

				<div className="h-full flex flex-col gap-md">
					<div className="flex items-start justify-between gap-md">
						<div className="flex items-center gap-md">
							<Avatar
								className="flex-shrink-0 leading-none"
								name={exam.owner.name}
								size="md"
								radius="xl"
								color="initials"
							>
								{getNameInitials(exam.owner.name)}
							</Avatar>

							<div>
								<p className="text-sm font-medium">{exam.owner.name}</p>
								<p className="text-dark-200 text-xs">{exam.owner.username}</p>
							</div>
						</div>

						<div className="flex flex-col items-end gap-md">
							<Badge
								size="md"
								variant="light"
								className="shrink-0"
								color={submitStatusColors[submitStatus]}
							>
								{SubmitStatus[submitStatus]}
							</Badge>

							{pendingCorrection && (
								<p className="text-dark-100 text-sm">
									Nota parcial: <b className="font-medium">{startedExam.grade} de {maxGrade}</b>
								</p>
							)}
						</div>

					</div>

					<Divider />

					<Title
						fz="2xl"
						order={2}
						title={exam.title}
						lineClamp={3}
						className="self-start"
					>
						{exam.title}
					</Title>

					<Text
						fz="xs"
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
								truncate="end"
								className="text-nowrap"
							>
								{history}
							</Text>
						</div>
					</div>
				</div>
			</Card>
		</Container>
	)
}

// TODO: Add remaining time to submit test
