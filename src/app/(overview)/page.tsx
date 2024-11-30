import type { Metadata } from "next"
import { MdAddCircleOutline } from "react-icons/md"
import { Button } from "@mantine/core"
import routes from "@app/routes"
import Link from "next/link"

const title = routes.homepage.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default function Homepage(){
	return (
		<div className="flex justify-between">
			<p>{title}</p>

			<Button
				href={routes.exam.children.create.pathname}
				variant="filled"
				component={Link}
				leftSection={<MdAddCircleOutline className="text-lg" />}
			>
				Criar teste
			</Button>
		</div>
	)
}
