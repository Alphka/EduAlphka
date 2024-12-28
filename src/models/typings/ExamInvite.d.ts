import type { Model, PopulatedDoc } from "mongoose"
import type { IExam } from "./Exam"

export interface IExamInvite {
	token: string
	exam: NonNullable<PopulatedDoc<IExam>>
	createdAt: Date
}

export type ExamInviteModel = Model<IExamInvite>
