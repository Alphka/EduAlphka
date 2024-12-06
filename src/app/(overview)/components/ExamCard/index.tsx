import type { IExam } from "@models/typings/Exam"
import { Badge, Box, Card, Group, Stack, Text, Tooltip } from "@mantine/core"
import { MdPerson } from "react-icons/md"
import getHistoryMessage, { type HistoryMessageProps } from "./helpers/getHistoryMessage"
import getStringColor from "@helpers/getStringColor"

interface ExamCardProps extends Pick<IExam, "title" | "subject" | "description">, HistoryMessageProps {
	active: boolean
	candidatesCount: number
}

export default function ExamCard({
	title,
	active,
	subject,
	description,
	createdAt,
	updatedAt,
	candidatesCount
}: ExamCardProps){
	const history = getHistoryMessage({ createdAt, updatedAt })

	return (
		<Card
			h="100%"
			p="lg"
			radius="sm"
			shadow="xs"
		>
			<Stack
				h="100%"
				justify="flex-end"
				gap="md"
			>
				<Group justify="space-between">
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
				</Group>

				<Text
					size="xs"
					c="dimmed"
					ta="justify"
					className="whitespace-pre-wrap"
					lineClamp={5}
				>
					{description}
				</Text>

				<Group
					mt="auto"
					align="flex-end"
					justify="space-between"
					flex={1}
				>
					<Group gap="xs">
						{!!subject && (
							<Group
								className="flex-shrink-0"
								gap="xs"
							>
								<Box
									bg={`${getStringColor(subject)}.5`}
									className="w-2.5 h-2.5 rounded-full"
								/>

								<Text fz="xs" fw={500}>
									{subject}
								</Text>
							</Group>
						)}
					</Group>

					<Group
						className="overflow-hidden"
						justify="flex-end"
						flex={1}
						gap="md"
					>
						<Tooltip
							py="sm"
							px="md"
							fz="xs"
							label="Número de candidatos participando do teste"
							events={{ hover: true, focus: false, touch: true }}
							position="top"
							withArrow
						>
							<Group
								className="flex-shrink-0"
								gap="xs"
							>
								<MdPerson className="text-sm" />

								<Text fz="xs" fw={500} lh={1}>
									{candidatesCount}
								</Text>
							</Group>
						</Tooltip>

						<Text
							fz="2xs"
							fw={400}
							title={new Date(updatedAt || createdAt).toLocaleString("pt-BR")}
							truncate="end"
						>
							{history}
						</Text>
					</Group>
				</Group>
			</Stack>
		</Card>
	)
}

export { default as ExamCardSkeleton } from "./Skeleton"
