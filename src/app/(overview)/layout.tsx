import type { RootLayoutProps } from "../layout"
import LayoutShell from "./components/LayoutShell"

interface LayoutProps extends RootLayoutProps {}

export default function Layout({ children }: LayoutProps){
	return (
		<LayoutShell>
			{children}
		</LayoutShell>
	)
}
