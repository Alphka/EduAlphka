import type { HydratedDocument, Model, Types } from "mongoose"
import type { IAnswer } from "./Answer"

export interface ISubmit {
	_id: Types.ObjectId
	user: Types.ObjectId
	exam: Types.ObjectId
	createdAt: Date
}

export interface ISubmitMethods {
	getAnswers: () => Promise<HydratedDocument<IAnswer>[]>
	isPendingCorrection: () => Promise<boolean>
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
