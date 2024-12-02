import type { QuestionTypes } from "@models/Exam"
import type { Model, Types } from "mongoose"
import type { DateType } from "."

export interface IAnswer {
	type: typeof QuestionTypes[keyof typeof QuestionTypes]
	submit: Types.ObjectId
	question: Types.ObjectId
	option?: Types.ObjectId
	content?: string
	isCorrect?: boolean
	createdAt: DateType
	updatedAt?: DateType
}

export type AnswerModel = Model<IAnswer>
