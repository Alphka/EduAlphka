import type { Model, ObjectId } from "mongoose"
import type { QuestionTypes } from "@models/Exam"
import type { DateType } from "."

export interface IAnswer {
	type: typeof QuestionTypes[keyof typeof QuestionTypes]
	submit: ObjectId
	question: ObjectId
	option?: ObjectId
	content?: string
	isCorrect?: boolean
	createdAt: DateType
	updatedAt?: DateType
}

export type AnswerModel = Model<IAnswer>
