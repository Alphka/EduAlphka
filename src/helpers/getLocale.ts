import getRequestURL from "./getRequestURL"

export default async function getLocale(){
	const { pathname } = new URL((await getRequestURL())!)
	return pathname.substring(1, pathname.indexOf("/", 1))
}
