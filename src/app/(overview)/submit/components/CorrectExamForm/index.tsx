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
	hasPublished: boolean
}

export default function CorrectExamForm({ submitId, exam, answers, hasPublished }: CorrectExamFormProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const titleId = useId()

	const formDisabled = hasPublished

	const answersByQuestion = new Map(answers.map(({ question, ...answer }) => [question, answer]))

	return (
		<form className="flex flex-col gap-lg">
			<h2 id={titleId} className="text-h3">
				Questões
			</h2>

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
						answer={answersByQuestion.get(questionId)}
						{...{
							type,
							text,
							options,
							submitId,
							isRequired,
							formDisabled
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
					type="submit"
					variant="filled"
					loading={isPending}
					onClick={event => {
						event.preventDefault()

						handleServerAction(sendCorrection(submitId))
					}}
					disabled={formDisabled}
				>
					Enviar correção
				</Button>
			</div>
		</form>
	)
}
