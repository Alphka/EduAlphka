import { Card, Skeleton } from "@mantine/core"
import { twJoin } from "tailwind-merge"

const textHeight = "1em"

export default function ExamCardSkeleton(){
	return (
		<a
			className={twJoin(
				"group relative h-full rounded-md overflow-hidden shadow-xs",
				"focus:outline-none"
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
						"absolute inset-0 pointer-events-none z-[1]",
						"group-hover:bg-blue-500/5",
						"group-focus-visible:bg-blue-500/10"
					)}
				/>

				<div className="h-full flex flex-col gap-md">
					<div className="flex items-start justify-between gap-md">
						<Skeleton height={textHeight} />
						<Skeleton height={`calc(${textHeight} * 1.25)`} width={50} />
					</div>

					<Skeleton height={`calc(${textHeight} / 2)`} />
					<Skeleton height={`calc(${textHeight} / 2)`} width="35%" />
					<Skeleton height={`calc(${textHeight} / 2)`} width="90%" />
					<Skeleton height={`calc(${textHeight} / 2)`} width="80%" />

					<div className="flex-grow flex items-end content-end flex-wrap gap-x-md gap-y-2">
						<div className="flex-shrink-0 flex items-center gap-xs">
							<Skeleton height={10} circle />
							<Skeleton height={textHeight} width={80} />
						</div>

						<div className="flex-grow flex items-center justify-end flex-wrap overflow-hidden gap-md">
							<div className="flex items-center gap-md">
								<div className="flex-shrink-0 flex items-center gap-xs">
									<Skeleton className="text-xs" height={textHeight} circle />
									<Skeleton height={textHeight} width={30} />
								</div>
							</div>

							<div className="flex-shrink-0 flex items-center gap-xs">
								<Skeleton className="text-xs" height={textHeight} circle />
								<Skeleton height={textHeight} width={30} />
							</div>

							<Skeleton height={textHeight} width={80} />
						</div>
					</div>
				</div>
			</Card>
		</a>
	)
}
