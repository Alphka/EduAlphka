import type { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose"
import type { IAnswer } from "./Answer"

export interface ISubmit {
	_id: Types.ObjectId
	user: NonNullable<PopulatedDoc<Types.ObjectId>>
	exam: NonNullable<PopulatedDoc<Types.ObjectId>>
	createdAt: Date
}

export interface ISubmitMethods {
	getAnswers: () => Promise<HydratedDocument<IAnswer>[]>
	isPendingCorrection: () => Promise<boolean>
}

export type SubmitModel = Model<ISubmit, {}, ISubmitMethods>
