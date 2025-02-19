"use server"

import type { HydratedDocument, Types } from "mongoose"
import type { IExam } from "@models/typings/Exam"
import type { IUser } from "@models/typings/User"
import { Notification, Submit } from "@models"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { after } from "next/server"
import sendEmail, { type GmailError } from "@lib/sendEmail"
import getSessionUserData from "@helpers/getSessionUserData"
import routes from "@app/routes"

const isProduction = process.env.NODE_ENV === "production"

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
			user: 1,
			publishedAt: 1
		})
		.populate<{
			exam: HydratedDocument<Pick<IExam, "_id" | "title">> & {
				owner: Types.ObjectId
			}
		}>("exam", {
			owner: 1,
			title: 1
		})
		.populate<{
			user: HydratedDocument<Pick<IUser, "_id" | "name" | "email" | "settings">> | null
		}>("user", {
			name: 1,
			email: 1,
			settings: 1
		})

	if(!submit) return { errors: ["Submissão não encontrada"] }
	if(submit.publishedAt) return { errors: ["Essa correção já foi publicada"] }
	if(!submit.exam.owner._id.equals(user.id)) return { errors: ["Você não tem permissão para executar essa ação"] }

	submit.publishedAt = new Date
	submit.markModified("publishedAt")

	if(submit.user){
		const notification = new Notification({
			user: submit.user,
			exam: submit.exam,
			title: "Correção finalizada",
			content: `<b>%owner.name%</b> corrigiu as suas respostas no teste “%exam.title%”.`,
			owner: user.id
		})

		await Promise.all([
			submit.save(),
			notification.save()
		]).catch(async error => {
			console.error(error)
			await notification.deleteOne()
			throw error
		})

		if(isProduction && submit.user.settings?.notifyExamCorrection){
			after(async () => {
				try{
					const examUrl = new URL(routes.exam.children.template.children.submit.pathname.replace("[id]", submit.exam.id), global.baseURL).href

					await sendEmail({
						to: submit.user!.email,
						subject: "Correção finalizada",
						text: `Olá, ${submit.user!.name}.\n\nA correção das suas respostas no teste “${submit.exam.title}” foi finalizada.\nVocê pode acessá-lo aqui: ${examUrl}`,
						html: `Olá, ${submit.user!.name}.<br><br>A correção das suas respostas no teste “<b>${submit.exam.title}</b>” foi finalizada.<br>Você pode acessá-lo aqui: <a href="${examUrl}">${examUrl}</a>`
					})
				}catch(error){
					const errorMessage = typeof error === "object" && error && "responseCode" in error
						? `[${(error as GmailError).code}] ${(error as GmailError).response?.split("\n").map(line => "\t" + line).join("\n")}`
						: error instanceof Error
							? error.message
							: error

					console.error("Error sending correction finished email:\n" + errorMessage)
				}
			})
		}
	}else{
		await submit.save()
	}

	revalidatePath(routes.homepage.pathname)
	// revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", submit.exam.id))
	revalidatePath(routes.submit.children.template.pathname.replace("[id]", submit.id))
	redirect(routes.exam.children.template.children.manage.pathname.replace("[id]", submit.exam.id))
}
