export default function getNameInitials(name: string){
	if(!(name = name?.trim())) throw new Error("Invalid name")
	if(name.length <= 2) return name.toLocaleUpperCase()

	const [firstName, secondName] = name
		.replace(/['.&\\\/-]/g, " ")
		.replace(/ {2,}g/g, "")
		.split(" ", 2)

	if(!secondName) return firstName[0].toLocaleUpperCase()

	return (firstName[0] + secondName[0]).toLocaleUpperCase()
}
