import type { MetadataRoute } from "next"
import { APPLICATION_NAME } from "./constants"

const BASE_URL = "https://edu-alphka.vercel.app"

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APPLICATION_NAME,
		short_name: APPLICATION_NAME,
		display: "standalone",
		theme_color: "#242424",
		background_color: "#242424",
		icons: [
			{
				src: BASE_URL + "/images/manifest-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable"
			},
			{
				src: BASE_URL + "/images/manifest-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable"
			}
		]
	}
}
