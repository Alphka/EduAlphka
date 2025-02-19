"use server"

import type { IExamInvite } from "@models/typings/ExamInvite"
import { Exam, ExamInvite } from "@models"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { Types } from "mongoose"
import getSessionUserData from "@helpers/getSessionUserData"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function generateExamInviteURL(id: string){
	if(!Types.ObjectId.isValid(id)){
		return { errors: ["ID do teste inválido"] }
	}

	const examId = new Types.ObjectId(id)

	await connectDatabase()

	const user = await getSessionUserData()

	if(!user) return { errors: ["Você precisa estar logado para executar essa ação"] }
	if(user.accountType !== "professor") return { errors: ["Você não tem permissão para executar essa ação"] }

	const exam = await Exam.findById(examId, { owner: 1 })

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	if(!exam.owner._id.equals(user.id)){
		return { errors: ["Você não tem permissão para executar essa ação"] }
	}

	const oldInvite = await ExamInvite.findOne({ exam: examId }, { _id: 1 })

	try{
		const inviteInfo = {
			get token(){
				return randomBytes(4).toString("hex")
			},
			exam: examId,
			createdAt: new Date
		} satisfies Omit<IExamInvite, "_id">

		while(true){
			try{
				if(oldInvite) await oldInvite.updateOne(inviteInfo).orFail()
				else await ExamInvite.create(inviteInfo)

				break
			}catch(error){
				if(error instanceof Error && error.name === "MongoServerError"){
					// If exam invite token already exists
					if("code" in error && error.code === 11000){
						console.error(`Failed to ${oldInvite ? "update" : "generate"} exam invite URL`)
						continue
					}
				}

				throw error
			}
		}
	}catch(error){
		console.error(error)
		return { errors: ["Falha ao gerar o link de convite para o teste"] }
	}

	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
}
