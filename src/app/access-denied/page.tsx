import BackButton from "./components/BackButton"
import getToken from "@helpers/getToken"

export default async function AccessDeniedPage(){
	const token = await getToken()
	const error = token ? 403 : 401

	return (
		<div className="min-h-dvh flex flex-col items-center justify-center px-xs py-20 gap-3xl">
			<div className="relative">
				<div className="block w-full h-min absolute top-0 left-0 right-0 text-gray-700/75 text-center text-[60px] xs:text-[120px] sm:text-[250px] font-[900] leading-[.8] overflow-hidden select-none">
					{error}
				</div>

				<div className="relative z-[1] pt-16 xs:pt-28 sm:pt-56 text-center">
					<h1 className="font-black text-2xl sm:text-1xl">
						Acesso negado
					</h1>

					<p className="text-lg text-gray-500 max-w-lg mx-auto mt-6 mb-12">
						Você não tem permissão para acessar esta página.
						Faça login com um usuário autorizado ou entre em contato com o administrador para mais informações.
					</p>

					<div className="flex justify-center">
						<BackButton
							size="md"
							aria-label="Voltar para a página anterior"
						>
							Voltar
						</BackButton>
					</div>
				</div>
			</div>
		</div>
	)
}
