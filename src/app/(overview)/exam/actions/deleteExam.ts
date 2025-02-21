"use server"

import { Answer, Exam, ExamInvite, Notification, StartedExam, Submit, User } from "@models"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Types } from "mongoose"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

export default async function deleteExamAction(id: string){
	if(!Types.ObjectId.isValid(id)){
		return { errors: ["ID do teste inválido"] }
	}

	try{
		const user = await getSessionUserData()

		if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
		if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

		const exam = await Exam.findById(id, {
			owner: 1,
			expiresAt: 1
		})

		if(!exam) return { errors: ["Teste não encontrado"] }
		if(!exam.owner._id.equals(user.id)) return { errors: ["Você não tem acesso a esse teste"] }

		if(!exam.isExpired()){
			const startedExams = (await Promise.all((await StartedExam.find({ exam }, {
				user: 1,
				createdAt: 1
			})).map(async startedExam => [await startedExam.isExpired({ exam }), startedExam] as const)))
				.filter(([isExpired]) => !isExpired)
				.map(([, startedExam]) => startedExam)

			const existingUsers = await User
				.find({
					_id: {
						$in: startedExams.map(startedExam => startedExam.user as Types.ObjectId)
					}
				}, { _id: 1 })
				.lean()

			if(existingUsers.length){
				return { errors: ["Não é possível excluir esse teste pois há candidatos que iniciaram o teste, mas ainda não o responderam"] }
			}
		}

		await Promise.allSettled([
			exam.deleteOne(),
			ExamInvite.deleteMany({ exam }),
			StartedExam.deleteMany({ exam }),
			Notification.deleteMany({ exam }),
			Submit.find({ exam }, { _id: 1 }).lean().then(submits => {
				const submitIds = submits.map(submit => submit._id)

				return Promise.all([
					Submit.deleteMany({ _id: { $in: submitIds } }),
					Answer.deleteMany({ submit: { $in: submitIds } })
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
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", id))
	redirect(routes.homepage.pathname)
}
