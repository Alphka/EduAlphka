interface SubmitStatusProps {
	pendingCorrection: boolean
	hasStartedExam: boolean
	hasAnswer: boolean
	isExpired: boolean
}

export function getSubmitStatus({
	pendingCorrection,
	hasStartedExam,
	hasAnswer,
	isExpired
}: SubmitStatusProps){
	return hasStartedExam
		? pendingCorrection
			? "Pendente"
			: isExpired
				? "Expirado"
				: hasAnswer
					? "Finalizado"
					: "Ativo"
		: "Não iniciado"
}

export type SubmitStatus = ReturnType<typeof getSubmitStatus>

export const submitStatusColors = {
	Ativo: "blue",
	Finalizado: "green",
	Pendente: "orange",
	Expirado: "red",
	"Não iniciado": "gray"
} satisfies Record<SubmitStatus, string>

export const submitStatusPriority = {
	Ativo: 0,
	Pendente: 1,
	Finalizado: 2,
	Expirado: 3,
	"Não iniciado": 4
} satisfies Record<SubmitStatus, number>
