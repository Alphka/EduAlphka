"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion } from "@models/typings/Exam"
import type { IAnswer } from "@models/typings/Answer"
import { createRef, useId, useMemo } from "react"
import { Button } from "@mantine/core"
import { toast } from "react-toastify"
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
	const { handleServerAction, isPending } = useServerActionHandler()
	const questionRefs = useMemo(() => Array.from(new Array(exam.questions.length), () => createRef<HTMLLIElement>()), [exam.questions.length])
	const titleId = useId()

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
						formDisabled={!canEdit}
						answer={answersByQuestion.get(questionId)}
						{...{
							type,
							text,
							options,
							submitId,
							isRequired
						}}
						questionRef={questionRefs[questionIndex]}
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
					type="button"
					variant="filled"
					loading={isPending}
					onClick={() => {
						if(!canEdit || isPending) return

						const pendingAnswerElement = questionRefs.find(ref => ref.current?.dataset.pending === "true")?.current

						if(pendingAnswerElement){
							pendingAnswerElement.scrollIntoView({
								behavior: "smooth",
								block: "center"
							})

							toast.error("Há respostas pendentes de correção")

							return
						}

						handleServerAction(sendCorrection(submitId))
					}}
					disabled={!canEdit}
				>
					Enviar correção
				</Button>
			</div>
		</section>
	)
}
