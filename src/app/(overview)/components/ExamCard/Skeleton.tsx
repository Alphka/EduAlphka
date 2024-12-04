import { Card, Group, Skeleton, Stack } from "@mantine/core"

const textHeight = "1em"

export default function ExamCardSkeleton(){
	return (
		<Card
			p="lg"
			radius="sm"
			shadow="xs"
		>
			<Stack gap="md">
				<Group justify="space-between">
					<Skeleton height={textHeight} />
					<Skeleton height={`calc(${textHeight} * 1.25)`} width={50} />
				</Group>

				<Skeleton height={`calc(${textHeight} / 2)`} />
				<Skeleton height={`calc(${textHeight} / 2)`} />
				<Skeleton height={`calc(${textHeight} / 2)`} width="80%" />

				<Group justify="space-between">
					<Group gap="xs">
						<Skeleton height={10} circle />
						<Skeleton height={textHeight} width={80} />
					</Group>

					<Group
						className="overflow-hidden"
						justify="flex-end"
						flex={1}
						gap="md"
					>
						<Group
							className="flex-shrink-0"
							gap="xs"
						>
							<Skeleton className="text-xs" height="1em" circle />
							<Skeleton height={textHeight} width={30} />
						</Group>

						<Skeleton height={textHeight} width={80} />
					</Group>
				</Group>
			</Stack>
		</Card>
	)
}
