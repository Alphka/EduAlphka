import { ComponentProps } from "react"
import { Switch } from "@mantine/core"
import changeUserSetting, { type PromiseName } from "../../actions/changeUserSetting"
import useServerActionHandler from "@hooks/useServerActionHandler"

interface ISettingSwitchProps extends ComponentProps<typeof Switch> {
	name: PromiseName
	promises: Set<string>
}

export default function SettingSwitch({ name, value, promises, ...props }: ISettingSwitchProps){
	const { isPending, handleServerAction } = useServerActionHandler()

	return (
		<Switch
			size="md"
			color="blue"
			radius="xl"
			classNames={{
				labelWrapper: "ml-4"
			}}
			labelPosition="right"
			onChange={async event => {
				if(isPending) return

				promises.add(name)

				await handleServerAction(changeUserSetting(name, event.currentTarget.checked))
				promises.delete(name)
			}}
			aria-busy={isPending}
			disabled={isPending}
			{...props}
		/>
	)
}
