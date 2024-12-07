import type { QuestionTypes } from "@models/Exam"
import type { HydratedDocument, Model, Types } from "mongoose"
import type { string } from "zod"

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
	options: IQuestionOption[]
	correctAnswer: Types.ObjectId
}

export interface ExamDissertativeQuestion extends ExamQuestionBase {
	type: "dissertative"
}

export type ExamQuestion = ExamMultipleChoiceQuestion | ExamDissertativeQuestion

export interface IExam {
	owner: Types.ObjectId
	title: string
	description: string
	subject?: string
	duration: number
	questions: ExamQuestion[]
	candidates: Types.ObjectId[]
	createdAt: Date
	updatedAt?: Date
	expiresAt?: Date
}

interface HydratedExamDocument extends HydratedDocument<Omit<IExam, "questions">> {
	questions: Types.DocumentArray<Omit<ExamQuestionBase & Partial<Omit<ExamMultipleChoiceQuestion, "type">> & Partial<Omit<ExamDissertativeQuestion, "type">> & { _id: Types.ObjectId }, "options"> & {
		options: Types.DocumentArray<IQuestionOption & { _id: Types.ObjectId }>
	}>
}

export type QuestionModel = Model<ExamQuestion>
export type OptionModel = Model<IQuestionOption>
export type ExamModel = Model<IExam, {}, {}, {}, HydratedExamDocument>
