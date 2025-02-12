interface SubmitStatusProps {
	pendingCorrection: boolean
	hasStartedExam: boolean
	hasSubmit: boolean
	isExpired: boolean
}

export function getSubmitStatus({
	pendingCorrection,
	hasStartedExam,
	hasSubmit,
	isExpired
}: SubmitStatusProps){
	if(isExpired) return SubmitStatus.Expirado
	if(!hasStartedExam) return SubmitStatus["Não iniciado"]
	if(pendingCorrection) return SubmitStatus.Pendente
	if(hasSubmit) return SubmitStatus.Finalizado
	return SubmitStatus.Ativo
}

export enum SubmitStatus {
	Ativo = 0,
	Pendente = 1,
	Finalizado = 2,
	Expirado = 3,
	"Não iniciado" = 4
}

export const submitStatusColors = {
	[SubmitStatus.Ativo]: "blue",
	[SubmitStatus.Finalizado]: "green",
	[SubmitStatus.Pendente]: "orange",
	[SubmitStatus.Expirado]: "red",
	[SubmitStatus["Não iniciado"]]: "gray"
}
