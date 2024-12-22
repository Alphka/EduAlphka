import type { QuestionTypes } from "@models/Exam"
import type { Model, Types } from "mongoose"

export interface IAnswer {
	_id: Types.ObjectId
	type: QuestionTypes
	submit: string | Types.ObjectId
	question: string | Types.ObjectId
	option?: string | Types.ObjectId
	content?: string
	isCorrect?: boolean
	createdAt: Date
	updatedAt?: Date
}

export type AnswerModel = Model<IAnswer>
