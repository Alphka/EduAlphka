"use server"

import type { ObjectIdToString } from "mongoose"
import type { INotification } from "@models/typings/Notification"
import type { IUser } from "@models/typings/User"
import { Notification } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"

export async function getNotifications(){
	await connectDatabase()

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }

	const notifications = await Notification
		.find({ user: user.id }, {
			user: 0,
			__v: 0
		})
		.populate("owner", {
			name: 1,
			username: 1
		})
		.sort({ createdAt: -1 })
		.limit(15)
		.lean<(Omit<INotification, "user" | "owner"> & {
			owner?: Pick<IUser, "_id" | "name" | "username">
		})[]>()

	for(const notification of notifications){
		notification.content = notification.content.replace("%owner.name%", notification.owner?.name ?? "Conta apagada")
	}

	return JSON.parse(JSON.stringify(notifications)) as ObjectIdToString<typeof notifications[number]>[]
}
