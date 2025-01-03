import type { ExamMultipleChoiceQuestion, ExamQuestion } from "@models/typings/Exam"
import type { IAnswer } from "@models/typings/Answer"
import { useId } from "react"
import CorrectExamFormQuestion from "./Question"

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
}

export default function CorrectExamForm({ submitId, exam, answers }: CorrectExamFormProps){
	const titleId = useId()

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
						answer={answersByQuestion.get(questionId)!}
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
		</form>
	)
}
