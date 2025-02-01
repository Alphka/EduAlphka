"use server"

import { Exam, StartedExam, User } from "@models"
import { revalidatePath } from "next/cache"
import { Types } from "mongoose"
import connectDatabase from "@lib/connectDatabase"
import normalizeEmail from "normalize-email"
import routes from "@app/routes"

export async function addCandidate(examId: string, usernameOrEmail: string){
	if(!Types.ObjectId.isValid(examId)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	const exam = await Exam.findById(examId, {
		candidates: 1,
		disallowedCandidates: 1
	})

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	const candidate = await User
		.findOne({
			$or: [
				{ normalizedEmail: normalizeEmail(usernameOrEmail) },
				{ username: usernameOrEmail }
			]
		}, {
			_id: 1,
			accountType: 1
		})
		.collation({ locale: "en", strength: 2 })

	if(!candidate) return { errors: ["Usuário não encontrado"] }
	if(candidate.accountType !== "candidate") return { errors: ["Este usuário não é um candidato"] }

	if(exam.candidates.includes(candidate._id)){
		return { errors: ["Candidato já adicionado ao teste"] }
	}

	if(exam.disallowedCandidates.includes(candidate._id)){
		return { errors: ["Esse candidato está desativado do teste"] }
	}

	exam.candidates.unshift(candidate._id)
	await exam.save()

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}

export async function removeCandidate(examId: string, userId: string, disable = false){
	if(!Types.ObjectId.isValid(examId)){
		return { errors: ["ID do teste inválido"] }
	}

	await connectDatabase()

	const exam = await Exam.findById(examId, {
		candidates: 1,
		disallowedCandidates: disable ? 1 : 0
	})

	if(!exam){
		return { errors: ["Teste não encontrado"] }
	}

	const startedExam = await StartedExam.exists({
		exam: examId,
		user: userId
	})

	if(startedExam){
		return { errors: [`Não é possível ${disable ? "desativar" : "remover"} um candidato que já iniciou o teste`] }
	}

	if(disable){
		exam.disallowedCandidates.addToSet(userId)
	}

	exam.candidates.pull(userId)

	if(exam.isModified()){
		await exam.save()
	}

	revalidatePath(routes.homepage.pathname)
	revalidatePath(routes.exam.children.list.pathname)
	revalidatePath(routes.exam.children.template.children.manage.pathname.replace("[id]", examId))
	revalidatePath(routes.exam.children.template.children.submit.pathname.replace("[id]", examId))
}
