import type { Types } from "mongoose"
import { Answer, Exam, ExamInvite, Notification, Session, StartedExam, Submit, User, VerificationCode } from "@models"
import { NextResponse } from "next/server"
import connectDatabase from "@lib/connectDatabase"

function deleteSessions(existingUsersIds: Types.ObjectId[]){
	return Session.deleteMany({
		$or: [
			{
				expiresAt: {
					$lt: new Date
				}
			},
			{
				user: {
					$nin: existingUsersIds
				}
			}
		]
	})
}

function deleteExams(existingUsersIds: Types.ObjectId[]){
	return Exam.deleteMany({
		owner: {
			$nin: existingUsersIds
		}
	})
}

function deleteSubmits(existingExamIds: Types.ObjectId[]){
	return Submit.deleteMany({
		exam: {
			$nin: existingExamIds
		}
	})
}

function deleteAnswers(existingSubmitIds: Types.ObjectId[]){
	return Answer.deleteMany({
		submit: {
			$nin: existingSubmitIds
		}
	})
}

function deleteExamInvites(existingExamIds: Types.ObjectId[]){
	return ExamInvite.deleteMany({
		exam: {
			$nin: existingExamIds
		}
	})
}

function deleteStartedExams(existingUsersIds: Types.ObjectId[], existingExamIds: Types.ObjectId[]){
	return StartedExam.deleteMany({
		$or: [
			{
				user: {
					$nin: existingUsersIds
				}
			},
			{
				exam: {
					$nin: existingExamIds
				}
			}
		]
	})
}

function deleteNotifications(existingUsersIds: Types.ObjectId[], existingExamIds: Types.ObjectId[]){
	return Notification.deleteMany({
		$or: [
			{
				user: {
					$nin: existingUsersIds
				}
			},
			{
				exam: {
					$exists: true,
					$nin: existingExamIds
				}
			},
			{
				owner: {
					$exists: true,
					$nin: existingUsersIds
				}
			}
		]
	})
}

function deleteVerificationCodes(existingUsersIds: Types.ObjectId[]){
	return VerificationCode.deleteMany({
		$or: [
			{
				expiresAt: {
					$lt: new Date
				}
			},
			{
				user: {
					$nin: existingUsersIds
				}
			}
		]
	})
}

export async function GET(){
	await connectDatabase()

	const existingUsersIds = await User.find({}, { _id: 1 }).lean().then(users => users.map(user => user._id))

	const results = await Promise.all([
		deleteSessions(existingUsersIds),
		deleteVerificationCodes(existingUsersIds),
		deleteExams(existingUsersIds).then(result => Exam.find({}, { _id: 1 }).lean().then(async exams => {
			const existingExamIds = exams.map(exam => exam._id)

			return [result, await Promise.all([
				deleteExamInvites(existingExamIds),
				deleteStartedExams(existingUsersIds, existingExamIds),
				deleteNotifications(existingUsersIds, existingExamIds),
				deleteSubmits(existingExamIds).then(result => Submit.find({}, { _id: 1 }).lean().then(async submits => {
					const existingSubmitIds = submits.map(submit => submit._id)

					return [result, await deleteAnswers(existingSubmitIds)]
				}))
			])]
		}))
	])

	console.log(results.flat(3))

	return new NextResponse(null, { status: 204 })
}
