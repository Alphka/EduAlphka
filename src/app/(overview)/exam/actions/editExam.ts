"use server"

import type { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Types } from "mongoose"
import { Exam } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import examSchema from "@schemas/exam"
import editExam from "@lib/editExam"
import routes from "@app/routes"

export default async function editExamAction(id: string, examData: z.infer<typeof examSchema>){
	if(!Types.ObjectId.isValid(id)){
		return { errors: ["ID do teste inválido"] }
	}

	try{
		await connectDatabase()

		const [user, exam] = await Promise.all([
			getSessionUserData(),
			Exam.findById(id)
		])

		if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
		if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }
		if(!exam) return { errors: ["Teste não encontrado"] }
		if(!exam.owner._id.equals(user.id)) return { errors: ["Você não tem permissão para editar esse teste"] }

		const { hasSubmit, hasStartedBySomeone } = await exam.submitInfo()

		if(hasSubmit) return { errors: ["Não é possível editar um teste que possui respostas"] }
		if(hasStartedBySomeone) return { errors: ["Não é possível editar um teste que já foi iniciado"] }

		editExam(user, exam, examData)

		await exam!.save()
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao cadastrar o teste"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
	redirect(routes.homepage.pathname)
}
