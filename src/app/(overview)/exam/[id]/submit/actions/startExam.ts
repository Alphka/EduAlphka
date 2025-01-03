"use server"

import { Exam, StartedExam } from "@models"
import { revalidatePath } from "next/cache"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

export default async function startExam(id: string){
	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "candidate") return { errors: ["Você não tem permissão para executar essa ação"] }

	if(!(await Exam.exists({ _id: id }))) return { errors: ["Teste não encontrado"] }

	await StartedExam.create({
		exam: id,
		user: user.id
	})

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
}
