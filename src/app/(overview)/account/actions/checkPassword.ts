"use server"

import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

export interface PersonalInformationData {
	password?: string
	username: string
	email: string
	name: string
}

export default async function checkPassword(currentPassword: string){
	try{
		await connectDatabase()

		const user = await getSessionUserData(true)

		if(!user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		if(!user.validatePassword(currentPassword)){
			return { errors: ["Credenciais inválidas"] }
		}
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao validar senha atual do usuário"] }
	}
}
