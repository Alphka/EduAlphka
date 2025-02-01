"use server"

import { Exam, ExamInvite } from "@models"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { Types } from "mongoose"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

async function saveInviteURL(examId: string, inviteId?: Types.ObjectId){
	const token = randomBytes(4).toString("hex")

	try{
		const inviteInfo = {
			token,
			exam: examId
		}

		return inviteId
			? await ExamInvite.updateOne({
				_id: inviteId,
				createdAt: new Date
			}, inviteInfo)
			: await ExamInvite.create(inviteInfo)
	}catch(error){
		if(error instanceof Error && error.name === "MongoServerError"){
			// If URL token already exists
			if("code" in error && error.code === 11000){
				return await saveInviteURL(examId, inviteId)
			}
		}

		throw error
	}
}

export async function generateExamInviteURL(id: string){
	if(!Types.ObjectId.isValid(id)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	if(!(await Exam.exists({ _id: id }))) {
		return { errors: ["Teste não encontrado"] }
	}

	const oldInvite = await ExamInvite.exists({ exam: id })

	try{
		await saveInviteURL(id, oldInvite?._id)
	}catch(error){
		console.error(error)
		return { errors: ["Falha ao gerar o link de convite para o teste"] }
	}

	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", id))
}
