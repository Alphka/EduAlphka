import type { Model, ObjectId } from "mongoose"
import type { QuestionTypes } from "@models/Exam"
import type { DateType } from "."

interface ExamQuestion {
	type: typeof QuestionTypes[keyof typeof QuestionTypes]
	text: string
	isRequired: boolean
}

interface ExamMultipleChoiceQuestion extends ExamQuestion {
	type: QuestionTypes.multiple_choice
	options: {
		text: string
	}[]
	correctAnswer: ObjectId
}

interface ExamDissertativeQuestion extends ExamQuestion {
	type: QuestionTypes.dissertative
}

export interface IExam {
	owner: ObjectId
	title: string
	description: string
	subject?: string
	duration: number
	questions: (ExamMultipleChoiceQuestion | ExamDissertativeQuestion)[]
	candidates: ObjectId[]
	createdAt: DateType
	updatedAt?: DateType
	expiresAt?: DateType
}

export type ExamModel = Model<IExam>
