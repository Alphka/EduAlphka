import type { CandidatesRowData } from "."

export type AnswerStatus = ReturnType<typeof getAnswerStatus>

export function getAnswerStatus({ startedAt, pendingCorrection, answered, expired }: Pick<CandidatesRowData, "startedAt" | "pendingCorrection" | "answered" | "expired">){
	return startedAt
		? pendingCorrection
			? "Pendente"
			: expired
				? "Expirado"
				: answered
					? "Finalizado"
					: "Ativo"
		: "Não iniciado"
}

export const statusColors = {
	Ativo: "blue",
	Finalizado: "green",
	Pendente: "orange",
	Expirado: "red",
	"Não iniciado": "gray"
} satisfies Record<AnswerStatus, string>

export const statusPriority = {
	Ativo: 0,
	Pendente: 1,
	Finalizado: 2,
	Expirado: 3,
	"Não iniciado": 4
} satisfies Record<AnswerStatus, number>
