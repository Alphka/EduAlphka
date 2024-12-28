import BackButton from "@components/BackButton"
import getToken from "@helpers/getToken"

export default async function AccessDeniedPage(){
	const token = await getToken()
	const error = token ? 403 : 401

	return (
		<div className="min-h-dvh flex flex-col items-center justify-center px-xs py-20 pt-20 pb-32 gap-3xl">
			<div className="relative">
				<div className="block w-full h-min absolute top-0 left-0 right-0 text-white/60 text-center text-[60px] xs:text-[120px] sm:text-[250px] font-[900] leading-[.8] overflow-hidden select-none">
					{error}
				</div>

				<div className="relative z-1 pt-16 xs:pt-28 sm:pt-56 text-center">
					<h1 className="text-white text-center text-h2 sm:text-h1 !font-[900]">
						Acesso negado
					</h1>

					<p className="max-w-lg text-dark-200 text-lg text-center mx-auto mt-xl mb-2xl">
						Você não tem permissão para acessar esta página.
						Faça login com um usuário autorizado ou entre em contato com o administrador para mais informações.
					</p>

					<div className="flex items-center justify-center">
						<BackButton />
					</div>
				</div>
			</div>
		</div>
	)
}
