import type { QuestionTypes } from "@models/Exam"
import type { Model, Types } from "mongoose"

export interface IAnswer {
	_id: Types.ObjectId
	type: typeof QuestionTypes[keyof typeof QuestionTypes]
	submit: Types.ObjectId
	question: Types.ObjectId
	option?: Types.ObjectId
	content?: string
	isCorrect?: boolean
	createdAt: Date
	updatedAt?: Date
}

export type AnswerModel = Model<IAnswer>
