"use server"

import type { Types } from "mongoose"
import { Answer, Exam, ExamInvite, StartedExam, Submit } from "@models"
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

		if(!exam.isExpired()){
			const hasSubmit = await Submit.exists({ exam: id })
			const hasStartedBySomeone = hasSubmit || await StartedExam.exists({ exam: id })

			if(hasStartedBySomeone && !hasSubmit){
				return { errors: ["Não é possível excluir esse teste pois há candidatos que iniciaram o teste mas ainda não o responderam"] }
			}
		}

		await Promise.allSettled([
			exam.deleteOne(),
			ExamInvite.deleteMany({ exam: id }),
			StartedExam.deleteMany({ exam: id }),
			Submit.find({ exam: id }, { _id: 1 }).lean().then(submits => {
				const submitIds = submits.map(submit => submit._id)

				return Promise.all([
					Answer.deleteMany({ submit: { $in: submitIds } }),
					Submit.deleteMany({ _id: { $in: submitIds } })
				])
			})
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
