function getRouteWithLocale<
	TRoute extends string,
	TLocale extends string
>(route: TRoute, locale: TLocale): typeof route extends "/"
	? `/${TLocale}`
	: typeof route extends "/logout"
		? "/logout"
		: `/${TLocale}${TRoute}`

function getRouteWithLocale(route: string, locale: string){
	if(route === "/") return `/${locale}`
	if(route === "/logout") return "/logout"
	return `/${locale}${route}`
}

export default getRouteWithLocale
