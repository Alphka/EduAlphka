"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion } from "@models/typings/Exam"
import type { IAnswer } from "@models/typings/Answer"
import { Button } from "@mantine/core"
import { useId } from "react"
import CorrectExamFormQuestion from "./Question"
import useServerActionHandler from "@hooks/useServerActionHandler"
import sendCorrection from "../../actions/sendCorrection"

export interface CorrectExamFormProps {
	submitId: string
	canEdit: boolean
	exam: {
		_id: string
		questions: (Pick<ExamQuestion, "type" | "text" | "isRequired"> & {
			_id: string
			options: (Pick<ExamMultipleChoiceQuestion["options"][number], "text"> & {
				_id: string
			})[]
		})[]
	}
	answers: (Pick<IAnswer, "content" | "feedback" | "isCorrect"> & {
		_id: string
		option?: string
		question: string
	})[]
}

export default function CorrectExamForm({ submitId, exam, answers, canEdit }: CorrectExamFormProps){
	const titleId = useId()
	const { handleServerAction, isPending } = useServerActionHandler()

	const answersByQuestion = new Map(answers.map(({ question, ...answer }) => [question, answer]))

	return (
		<section className="flex flex-col gap-lg">
			<h1 id={titleId} className="text-h3">
				Questões
			</h1>

			<ul
				className="flex flex-col gap-md"
				aria-labelledby={titleId}
			>
				{exam.questions.map(({
					_id: questionId,
					type,
					text,
					options,
					isRequired
				}, questionIndex) => (
					<CorrectExamFormQuestion
						questionNumber={questionIndex + 1}
						formDisabled={canEdit}
						answer={answersByQuestion.get(questionId)}
						{...{
							type,
							text,
							options,
							submitId,
							isRequired
						}}
						key={questionId}
					/>
				))}
			</ul>

			<div className="flex flex-col items-start gap-md">
				<div className="text-xs">
					<p>Após o envio da correção, não será possível editá-la.</p>
					<p>Corrija todas as informações antes de enviar o formulário.</p>
				</div>

				<Button
					variant="filled"
					loading={isPending}
					onClick={() => handleServerAction(sendCorrection(submitId))}
					disabled={canEdit}
				>
					Enviar correção
				</Button>
			</div>
		</section>
	)
}
