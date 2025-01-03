"use server"

import { revalidatePath } from "next/cache"
import { Exam, User } from "@models"
import connectDatabase from "@lib/connectDatabase"
import routes from "@app/routes"

export async function addCandidate(examId: string, usernameOrEmail: string){
	await connectDatabase()

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

	if(exam.candidates.some(id => id._id.equals(candidate._id))){
		return { errors: ["Candidato já adicionado ao teste"] }
	}

	exam.candidates.unshift(candidate._id)
	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}

export async function removeCandidate(examId: string, userId: string){
	await connectDatabase()

	const exam = await Exam.findById(examId, { candidates: 1 })

	if(!exam) return { errors: ["Teste não encontrado"] }

	exam.candidates.pull(userId)
	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}
