"use server"

import type { Types } from "mongoose"
import { Exam, ExamInvite, StartedExam, Submit } from "@models"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export default async function deleteExamAction(id: string){
	try{
		await connectDatabase()

		const user = await getSessionUserData()

		if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
		if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

		const exam = await Exam.findById(id, { owner: 1 })

		if(!exam) return { errors: ["Teste não encontrado"] }
		if(!(exam.owner as Types.ObjectId).equals(user.id)) return { errors: ["Você não tem acesso a esse teste"] }

		const hasSubmit = await Submit.exists({ exam: id })
		const hasStartedBySomeone = hasSubmit || await StartedExam.exists({ exam: id })

		if(hasSubmit) return { errors: ["Não é possível excluir um teste que possui respostas"] }
		if(hasStartedBySomeone) return { errors: ["Não é possível excluir um teste que já foi iniciado"] }

		await Promise.allSettled([
			exam.deleteOne(),
			ExamInvite.deleteMany({ exam: id }),
			StartedExam.deleteMany({ exam: id }),
			Submit.deleteMany({ exam: id })
		])
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao excluir o teste"] }
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
	redirect(routes.homepage.pathname)
}
