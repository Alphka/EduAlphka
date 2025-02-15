import type { MetadataRoute } from "next"
import { APPLICATION_NAME } from "./constants"
import manifest512 from "@images/manifest-512x512.png"
import manifest192 from "@images/manifest-192x192.png"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APPLICATION_NAME,
		short_name: APPLICATION_NAME,
		display: "standalone",
		start_url: "/",
		theme_color: "#ffffff",
		background_color: "#242424",
		icons: [
			{
				src: manifest192.src,
				sizes: `${manifest192.width}x${manifest192.height}`,
				type: "image/png",
				purpose: "maskable"
			},
			{
				src: manifest512.src,
				sizes: `${manifest512.width}x${manifest512.height}`,
				type: "image/png",
				purpose: "maskable"
			}
		]
	}
}
