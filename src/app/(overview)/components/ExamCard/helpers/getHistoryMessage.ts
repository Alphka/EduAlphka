export interface HistoryMessageProps {
	createdAt: Date
	updatedAt?: Date
}

export default function getHistoryMessage({ createdAt, updatedAt }: HistoryMessageProps){
	return `${updatedAt ? "Atualizado em" : "Criado em"} ${(updatedAt || createdAt).toLocaleDateString("pt-BR")}` as const
}
