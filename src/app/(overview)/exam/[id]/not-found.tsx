import getRequestURL from "@helpers/getRequestURL"
import BackButton from "@components/BackButton"

export default async function NotFoundPage(){
	const url = await getRequestURL()
	const examId = url && new URL(url).pathname.substring(1).split("/")[1]
	const isExamPage = !!examId && examId.length === 24 && /^[0-9a-fA-F]+$/.test(examId)

	return (
		<div className="main-height flex flex-col items-center justify-center p-5xl gap-3xl">
			<h1 className="text-h2 font-semibold text-center">
				{isExamPage ? "Esse teste não foi encontrado" : "Página não encontrada"}
			</h1>

			<BackButton>
				Voltar
			</BackButton>
		</div>
	)
}
