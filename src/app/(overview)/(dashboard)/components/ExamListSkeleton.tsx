import { ExamCardSkeleton } from "../../components/ExamCard"
import { Grid, GridCol } from "@mantine/core"

interface ExamListProps {
	limit: number
}

export default function ExamListSkeleton({ limit }: ExamListProps){
	return (
		<Grid gutter="md">
			{Array.from(new Array(limit), (_, index) => (
				<GridCol
					span={{
						base: 12,
						md: 6,
						lg: 4
					}}
					key={index}
				>
					<ExamCardSkeleton />
				</GridCol>
			))}
		</Grid>
	)
}
