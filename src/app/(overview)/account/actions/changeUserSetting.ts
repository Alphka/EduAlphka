"use server"

import type { IUser } from "@models/typings/User"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

export type PromiseName = keyof NonNullable<IUser["settings"]>

export default async function changeUserSetting(name: PromiseName, value: boolean){
	try{
		await connectDatabase()

		const user = await getSessionUserData(true)

		if(!user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		user.settings ??= {}
		user.settings[name] = value
		user.markModified("settings")

		await user.save()
	}catch(error){
		console.error(error)

		return { errors: ["Falha ao salvar as alterações"] }
	}
}
