import BackButton from "@components/BackButton"

export default function NotFoundPage(){
	return (
		<div className="main-height flex flex-col items-center justify-center p-5xl gap-3xl">
			<h1 className="text-h2 font-semibold text-center">
				Esse teste não foi encontrado
			</h1>

			<BackButton>
				Voltar
			</BackButton>
		</div>
	)
}
