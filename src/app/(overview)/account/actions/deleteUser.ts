"use server"

import {
	Answer,
	Exam,
	ExamInvite,
	Notification,
	Session,
	StartedExam,
	Submit,
	VerificationCode
} from "@models"
import { TOKEN_KEY } from "@constants"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import connectDatabase from "@lib/connectDatabase"
import getUserByToken from "@helpers/getUserByToken"
import getToken from "@helpers/getToken"
import routes from "@app/routes"

export default async function deleteUser(){
	const cookiesStore = await cookies()

	try{
		await connectDatabase()

		const token = await getToken()
		const user = token && await getUserByToken(token, true)

		if(!token || !user){
			return { errors: ["Você precisa estar logado para executar essa ação"] }
		}

		await user.deleteOne().orFail()

		await Promise.all([
			user.accountType === "professor" && [
				Exam.find({ owner: user._id }, { _id: 1 }).then(exams => {
					const examIds = exams.map(exam => exam._id)

					return Promise.all([
						Exam.deleteMany({ _id: { $in: examIds } }),
						ExamInvite.deleteMany({ exam: { $in: examIds } }),
						StartedExam.deleteMany({ exam: { $in: examIds } }),
						Submit.find({ exam: { $in: examIds } }, { _id: 1 }).lean().then(submits => {
							const submitIds = submits.map(submit => submit._id)

							return Promise.all([
								Submit.deleteMany({ _id: { $in: submitIds } }),
								Answer.deleteMany({ submit: { $in: submitIds } })
							])
						})
					])
				}),
				VerificationCode.deleteMany({ owner: user })
			],
			VerificationCode.deleteMany({ user }),
			Notification.deleteMany({ user }),
			Session.deleteMany({
				$or: [
					{ token },
					{ user: user._id }
				]
			})
		])
	}catch(error){
		if(typeof error === "string") return { errors: [error] }
		if(Array.isArray(error)) return { errors: error as string[] }

		console.error(error)

		return { errors: ["Falha ao remover a conta do usuário"] }
	}

	cookiesStore.delete(TOKEN_KEY)

	redirect(routes.login.pathname)
}
