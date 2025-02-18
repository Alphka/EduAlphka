"use server"

import { Notification } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

export async function readNotifications(){
	try{
		await connectDatabase()

		const user = await getSessionUserData()

		if(!user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		await Notification.updateMany({
			user: user.id,
			readAt: {
				$exists: false
			}
		}, { readAt: new Date })
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao buscar as notificações"] }
	}
}
