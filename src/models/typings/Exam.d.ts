import type { QuestionTypes } from "@models/Exam"
import type { Model, Types } from "mongoose"

interface IExamQuestion {
	type: keyof typeof QuestionTypes
	text: string
	isRequired: boolean
}

export interface ExamMultipleChoiceQuestion extends IExamQuestion {
	type: "multiple_choice"
	options: {
		text: string
	}[]
	correctAnswer: Types.ObjectId
}

export interface ExamDissertativeQuestion extends IExamQuestion {
	type: "dissertative"
}

export type TQuestionOption = ExamMultipleChoiceQuestion | ExamDissertativeQuestion

export interface IExam {
	owner: Types.ObjectId
	title: string
	description: string
	subject?: string
	duration: number
	questions: TQuestionOption[]
	candidates: Types.ObjectId[]
	createdAt: Date
	updatedAt?: Date
	expiresAt?: Date
}

export type QuestionModel = Model<IExamQuestion>
export type OptionModel = Model<TQuestionOption>
export type ExamModel = Model<IExam>
