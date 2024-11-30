import { Divider } from "@mantine/core"
import type { HTMLAttributes } from "react"
import { twMerge } from "tailwind-merge"

const titleClassNames = "text-neutral-100 text-xl leading-tight font-semibold"

export default function Legend({ className, children, ...props }: HTMLAttributes<HTMLLegendElement>){
	if(typeof children === "string" || typeof children === "number"){
		children = (
			<h2 className="text-current text-[length:inherit] font-inherit">
				{children}
			</h2>
		)
	}

	return (
		<legend
			className={twMerge(
				"w-full flex flex-col gap-1 pb-8",
				titleClassNames,
				className
			)}
			{...props}
		>
			{children}
			<Divider bd="gray" />
			{/* <hr className="border-neutral-300 border-x-0 border-t border-b-0" /> */}
		</legend>
	)
}
