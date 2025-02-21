"use server"

import type { ObjectIdToString } from "mongoose"
import type { INotification } from "@models/typings/Notification"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { Notification } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

type NotificationObject = Omit<INotification, "exam" | "user" | "owner"> & {
	exam?: Pick<IExam, "_id" | "title">
	owner?: Pick<IUser, "_id" | "name" | "username">
}

export async function getNotifications(){
	try{
		await connectDatabase()

		const user = await getSessionUserData()

		if(!user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		const notifications = await Notification
			.find({ user: user.id }, {
				user: 0,
				__v: 0
			})
			.populate("exam", {
				title: 1
			})
			.populate("owner", {
				name: 1,
				username: 1
			})
			.sort({ createdAt: "descending" })
			.limit(15)
			.lean<NotificationObject[]>()

		for(const notification of notifications){
			notification.content = notification.content
				.replace("%owner.name%", notification.owner?.name ?? "Conta apagada")
				.replace("%exam.title%", notification.exam?.title ?? "Teste sem título")
		}

		return JSON.parse(JSON.stringify(notifications)) as ObjectIdToString<typeof notifications[number]>[]
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao buscar as notificações"] }
	}
}
