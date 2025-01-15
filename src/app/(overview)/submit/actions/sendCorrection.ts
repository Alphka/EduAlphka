"use server"

import type { HydratedDocument, Types } from "mongoose"
import type { IExam } from "@models/typings/Exam"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Submit } from "@models"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

export default async function sendCorrection(submitId: string){
	if(!submitId){
		return { errors: ["ID da submissão inválido"] }
	}

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const submit = await Submit
		.findById(submitId, {
			exam: 1,
			publishedAt: 1
		})
		.populate<{
			exam: HydratedDocument<Pick<IExam, "_id">> & {
				owner: Types.ObjectId
			}
		}>("exam", "owner")

	if(!submit) return { errors: ["Submissão não encontrada"] }
	if(submit.publishedAt) return { errors: ["Essa submissão já foi publicada"] }
	if(!submit.exam.owner._id.equals(user.id)) return { errors: ["Você não tem permissão para executar essa ação"] }

	submit.publishedAt = new Date
	submit.markModified("publishedAt")
	await submit.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", submit.exam.id))
	revalidatePath(routes.submit.children.template.pathname.replace("[id]", submit.id))
	redirect(routes.exam.children.template.children.manage.pathname.replace("[id]", submit.exam.id))
}
