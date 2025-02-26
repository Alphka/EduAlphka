import type { Metadata } from "next"
import { Suspense } from "react"
import verifyAuthorization from "@helpers/verifyAuthorization"
import ExamListSkeleton from "@components/ExamListSkeleton"
import CreatedExamList from "./components/CreatedExamList"
import routes from "@app/routes"

const title = routes.exam.children.list.title

export const metadata: Metadata = {
	title,
	openGraph: {
		title
	}
}

export default async function ListExamPage(){
	const user = await verifyAuthorization()

	return (
		<div className="flex flex-col gap-lg">
			<header className="flex justify-end flex-wrap-reverse gap-md">
				<h1 className="flex-grow text-h4 xs:text-h3 font-bold">
					Lista de testes criados
				</h1>
			</header>

			<Suspense fallback={<ExamListSkeleton limit={6} />}>
				<CreatedExamList
					userId={user.id}
				/>
			</Suspense>
		</div>
	)
}
