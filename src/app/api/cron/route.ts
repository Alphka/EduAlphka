import { Answer, Exam, ExamInvite, Session, StartedExam, Submit, User, VerificationCode } from "@models"
import { NextResponse } from "next/server"
import connectDatabase from "@lib/connectDatabase"

async function deleteExpiredSessions(){
	await Session.deleteMany({
		expiresAt: {
			$lt: new Date
		}
	})
}

async function deleteSessionsWithoutUsers(existingUsers: string[]){
	await Session.deleteMany({
		user: {
			$nin: existingUsers
		}
	})
}

async function deleteSubmitWithoutExams(existingExamIds: string[]){
	await Submit.deleteMany({
		exam: {
			$nin: existingExamIds
		}
	})
}

async function deleteAnswersWithoutSubmits(existingSubmitIds: string[]){
	await Answer.deleteMany({
		submit: {
			$nin: existingSubmitIds
		}
	})
}

async function deleteExamInvitesWithoutExams(existingExamIds: string[]){
	await ExamInvite.deleteMany({
		exam: {
			$nin: existingExamIds
		}
	})
}

async function deleteStartedExamsWithoutExams(existingExamIds: string[]){
	await StartedExam.deleteMany({
		exam: {
			$nin: existingExamIds
		}
	})
}

async function deleteExpiredVerificationCodes(){
	await VerificationCode.deleteMany({
		expiresAt: {
			$lt: new Date
		}
	})
}

async function deleteVerificationCodesWithoutUsers(existingUsers: string[]){
	await VerificationCode.deleteMany({
		user: {
			$nin: existingUsers
		}
	})
}

export async function GET(){
	await connectDatabase()

	const [existingUsers, existingExamIds, existingSubmitIds] = await Promise.all([
		User.find({}, { _id: 1 }).lean().then(users => users.map(user => user._id.toString())),
		Exam.find({}, { _id: 1 }).lean().then(exams => exams.map(exam => exam._id.toString())),
		Submit.find({}, { _id: 1 }).lean().then(submits => submits.map(submit => submit._id.toString()))
	])

	await Promise.all([
		deleteExpiredSessions(),
		deleteSessionsWithoutUsers(existingUsers),
		deleteSubmitWithoutExams(existingExamIds),
		deleteAnswersWithoutSubmits(existingSubmitIds),
		deleteExamInvitesWithoutExams(existingExamIds),
		deleteStartedExamsWithoutExams(existingExamIds),
		deleteExpiredVerificationCodes(),
		deleteVerificationCodesWithoutUsers(existingUsers)
	])

	return new NextResponse(null, { status: 204 })
}
