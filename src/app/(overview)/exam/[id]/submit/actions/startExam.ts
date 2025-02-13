"use server"

import { Exam, StartedExam } from "@models"
import { revalidatePath } from "next/cache"
import { Types } from "mongoose"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

export default async function startExam(id: string){
	if(!Types.ObjectId.isValid(id)){
		return { errors: ["ID do teste inválido"] }
	}

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "candidate") return { errors: ["Você não tem permissão para executar essa ação"] }

	const exam = await Exam
		.findById(id, {
			candidates: 1,
			startsAt: 1
		})
		.lean()

	if(!exam) return { errors: ["Teste não encontrado"] }
	if(!exam.candidates.some(candidate => candidate._id.equals(user.id))) return { errors: ["Você não está inscrito nesse teste"] }
	if(exam.startsAt && Date.now() < exam.startsAt.getTime()) return { errors: ["Esse teste não iniciou ainda"]}

	await StartedExam.create({
		exam,
		user: user.id
	})

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
}
