import type { Model, PopulatedDoc, Types } from "mongoose"
import type { QuestionTypes } from "../Exam/Question"
import type { IStartedExam } from "./StartedExam"
import type { IAnswer } from "./Answer"
import type { ISubmit } from "./Submit"
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

export type MixedExamQuestion =
	& ExamQuestionBase
	& Omit<ExamMultipleChoiceQuestion, "type">
	& Omit<ExamDissertativeQuestion, "type">

export interface IExam {
	_id: Types.ObjectId
	owner: NonNullable<PopulatedDoc<IUser>>
	title: string
	description: string
	subject?: string
	duration: number
	questions: Types.DocumentArray<ExamQuestion, Types.Subdocument<ExamQuestion, any, ExamQuestion> & ExamQuestion>
	candidates: Types.Array<NonNullable<PopulatedDoc<IUser>>>
	createdAt: Date
	updatedAt?: Date
	expiresAt?: Date
}

interface SubmitWithAnswers extends ISubmit {
	exam: Types.ObjectId
	user: Types.ObjectId
	answers: IAnswer[]
}

export interface StartedExamWithSubmit extends IStartedExam {
	exam: Types.ObjectId
	user: Types.ObjectId
	/** Is null if the exam was not submitted */
	grade: number | null
	submit?: SubmitWithAnswers
	pendingAnswers: number
	pendingCorrection: boolean
}

export interface IExamMethods {
	isExpired(): boolean
	submitInfo(): Promise<{
		hasSubmit: boolean
		hasStartedBySomeone: boolean
	}>
	submitData(candidate: Types.ObjectId | string): Promise<StartedExamWithSubmit | null>
	submitData(candidates: (Types.ObjectId | string)[]): Promise<StartedExamWithSubmit[]>
}

export type QuestionModel = Model<ExamQuestion>
export type OptionModel = Model<IQuestionOption>
export type ExamModel = Model<IExam, {}, IExamMethods>
