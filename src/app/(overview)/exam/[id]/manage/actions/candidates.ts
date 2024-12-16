"use server"

import type { Types } from "mongoose"
import { revalidatePath } from "next/cache"
import { Exam, User } from "@models"
import routes from "@app/routes"

export async function addCandidate(examId: string, usernameOrEmail: string){
	const exam = await Exam.findById(examId, { candidates: 1 })

	if(!exam) return { errors: ["Teste não encontrado"] }

	const candidate = await User
		.findOne({
			$or: [
				{ email: usernameOrEmail },
				{ username: usernameOrEmail }
			]
		}, {
			_id: 1,
			accountType: 1
		})
		.collation({ locale: "en", strength: 2 })

	if(!candidate) return { errors: ["Usuário não encontrado"] }
	if(candidate.accountType !== "candidate") return { errors: ["Este usuário não é um candidato"] }

	if(exam.candidates.some(id => (id as Types.ObjectId).equals(candidate._id))) return { errors: ["Candidato já adicionado ao teste"] }

	exam.candidates.unshift(candidate._id)
	exam.markModified("candidates")
	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
}

export async function removeCandidate(examId: string, userId: string){
	const exam = await Exam.findById(examId, { candidates: 1 })

	if(!exam) return { errors: ["Teste não encontrado"] }

	const deleteIndexes: number[] = []

	exam.candidates.forEach((candidate, index) => {
		if(!candidate) deleteIndexes.push(index)
		else if((candidate as Types.ObjectId).equals(userId)) deleteIndexes.push(index)
	})

	for(const index of deleteIndexes.reverse()){
		exam.candidates.splice(index, 1)
	}

	exam.markModified("candidates")
	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
}
