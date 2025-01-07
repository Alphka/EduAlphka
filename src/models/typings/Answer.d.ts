import type { Model, PopulatedDoc, Types } from "mongoose"
import type { QuestionTypes } from "../Exam"
import type { ISubmit } from "./Submit"

export interface IAnswer {
	_id: Types.ObjectId
	type: keyof typeof QuestionTypes
	submit: NonNullable<PopulatedDoc<ISubmit>>
	question: Types.ObjectId
	option?: Types.ObjectId
	content?: string
	isCorrect?: boolean
	feedback?: string
	createdAt: Date
	updatedAt?: Date
}

export type AnswerModel = Model<IAnswer>
