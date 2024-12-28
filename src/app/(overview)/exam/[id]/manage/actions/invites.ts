"use server"

import type { Types } from "mongoose"
import { Exam, ExamInvite } from "@models"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

async function saveInviteURL(examId: string, inviteId?: Types.ObjectId){
	const token = randomBytes(4).toString("hex")

	try{
		const inviteInfo = {
			token,
			exam: examId
		}

		if(inviteId){
			return await ExamInvite.updateOne({ _id: inviteId }, inviteInfo)
		}

		return await ExamInvite.create(inviteInfo)
	}catch(error){
		if(error instanceof Error && error.name === "MongoServerError"){
			if("code" in error && error.code === 11000){
				return await saveInviteURL(examId, inviteId)
			}
		}

		throw error
	}
}

export async function generateExamInviteURL(id: string){
	await connectDatabase()

	if(!(await Exam.exists({ _id: id }))) return { errors: ["Teste não encontrado"] }

	const oldInvite = await ExamInvite.findOne({ exam: id }, { _id: 1 })

	try{
		await saveInviteURL(id, oldInvite?._id)
	}catch(error){
		console.error(error)
		return { errors: ["Falha ao gerar o link de convite para o teste"] }
	}

	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
}
