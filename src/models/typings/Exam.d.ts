import type { QuestionTypes } from "@models/Exam"
import type { Model, Types } from "mongoose"

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

export type ExamQuestion = ExamMultipleChoiceQuestion | ExamDissertativeQuestion

export interface IExam {
	_id: Types.ObjectId
	owner: Types.ObjectId
	title: string
	description: string
	subject?: string
	duration: number
	questions: Types.DocumentArray<ExamQuestion>
	candidates: Types.ObjectId[]
	createdAt: Date
	updatedAt?: Date
	expiresAt?: Date
}

export type QuestionModel = Model<ExamQuestion>
export type OptionModel = Model<IQuestionOption>
export type ExamModel = Model<IExam>
