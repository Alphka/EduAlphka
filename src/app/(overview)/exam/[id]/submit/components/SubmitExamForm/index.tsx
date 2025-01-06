"use client"

import type { ExamMultipleChoiceQuestion, ExamQuestion } from "@models/typings/Exam"
import type { IAnswer } from "@models/typings/Answer"
import { useForm, type DefaultValues } from "react-hook-form"
import { Button } from "@mantine/core"
import { useId } from "react"
import useServerActionHandler from "@hooks/useServerActionHandler"
import SubmitExamFormQuestion from "./Question"
import submitExam from "../../actions/submitExam"

interface SubmitExamFormProps {
	defaultValues?: DefaultValues<SubmitFormData>
	loading?: boolean
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
	})[] | undefined
}

export interface SubmitFormData {
	question: ({
		option?: string
		content?: string
	})[]
}

export default function SubmitExamForm({
	defaultValues,
	loading,
	answers,
	exam
}: SubmitExamFormProps){
	const { handleServerAction, isPending } = useServerActionHandler()
	const titleId = useId()

	const answersByQuestion = answers && new Map(answers.map(({ question, ...answer }) => [question, answer]))

	const formDisabled = loading || !!answers

	const {
		watch,
		register,
		setValue,
		clearErrors,
		handleSubmit,
		formState: { errors }
	} = useForm<SubmitFormData>({
		reValidateMode: "onChange",
		defaultValues,
		disabled: formDisabled,
		mode: "onSubmit"
	})

	return (
		<form
			className="flex flex-col gap-lg"
			onSubmit={handleSubmit(({ question: questions }) => {
				handleServerAction(submitExam(exam._id, {
					questions: questions.map((data, index) => ({
						id: exam.questions[index]._id,
						...data
					}))
				} as Parameters<typeof submitExam>[1]))
			})}
		>
			<h2 id={titleId} className="text-h3">
				Questões
			</h2>

			<ul
				className="flex flex-col gap-md"
				aria-labelledby={titleId}
			>
				{exam.questions.map(({ _id, ...question }, questionIndex) => (
					<SubmitExamFormQuestion
						{...{
							...question,
							watch,
							errors,
							register,
							setValue,
							clearErrors,
							formDisabled,
							questionIndex
						}}
						answer={answersByQuestion?.get(_id)!}
						key={_id}
					/>
				))}
			</ul>

			<div className="flex flex-col items-start gap-md">
				<div className="text-xs">
					<p>Este conteúdo foi criado pelo proprietário do formulário.</p>
					<p>Os dados que você enviar serão enviados ao proprietário do formulário.</p>
					<p>Nunca forneça sua senha.</p>
				</div>

				<Button
					type="submit"
					variant="filled"
					loading={isPending}
					disabled={formDisabled}
				>
					Finalizar formulário
				</Button>
			</div>
		</form>
	)
}

// TODO: Display correct and wrong answers to the candidate
