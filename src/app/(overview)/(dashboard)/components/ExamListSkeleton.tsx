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
						lg: 6,
						xl: 4
					}}
					key={index}
				>
					<ExamCardSkeleton />
				</GridCol>
			))}
		</Grid>
	)
}
