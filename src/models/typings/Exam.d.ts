import type { Model, PopulatedDoc, Types } from "mongoose"
import type { QuestionTypes } from "@models/Exam"
import type { IUser } from "./User"

export interface ExamQuestionBase {
	type: keyof typeof QuestionTypes
	text: string
	isRequired: boolean
}

export interface IQuestionOption {
	text: string
}

export interface ExamMultipleChoiceQuestion extends ExamQuestionBase {
	type: "multiple_choice"
	options: Types.DocumentArray<IQuestionOption>
	correctAnswer: Types.ObjectId
}

export interface ExamDissertativeQuestion extends ExamQuestionBase {
	type: "dissertative"
}

export type ExamQuestion = (ExamMultipleChoiceQuestion | ExamDissertativeQuestion) & {
	_id: Types.ObjectId
}

export interface IExam {
	_id: Types.ObjectId
	owner: NonNullable<PopulatedDoc<IUser>>
	title: string
	description: string
	subject?: string
	duration: number
	questions: Types.DocumentArray<ExamQuestion>
	candidates: NonNullable<PopulatedDoc<IUser>>[]
	createdAt: Date
	updatedAt?: Date
	expiresAt?: Date
}

export interface IExamMethods {
	isExpired(): boolean
}

export type QuestionModel = Model<ExamQuestion>
export type OptionModel = Model<IQuestionOption>
export type ExamModel = Model<IExam, {}, IExamMethods>
