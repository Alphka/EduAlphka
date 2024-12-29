import type { Model, PopulatedDoc, Types } from "mongoose"
import type { IExam } from "./Exam"

export interface IExamInvite {
	_id: Types.ObjectId
	token: string
	exam: NonNullable<PopulatedDoc<IExam>>
	createdAt: Date
}

export type ExamInviteModel = Model<IExamInvite>
