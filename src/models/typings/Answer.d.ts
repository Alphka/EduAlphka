import type { Model, ObjectId } from "mongoose"
import type { QuestionType } from "./Exam"
import type { DateType } from "."
import type { UUID } from "crypto"

export interface IAnswer {
	type: QuestionType
	submit: ObjectId
	question: ObjectId
	option?: UUID
	content?: string
	isCorrect?: boolean
	createdAt: DateType
	updatedAt?: DateType
}

export type AnswerModel = Model<IAnswer>
