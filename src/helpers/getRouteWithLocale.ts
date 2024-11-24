import getLocale from "./getLocale"

function getRouteWithLocale<TRoute extends string, TLocale extends string>(route: TRoute, locale: TLocale): typeof route extends "/" ? `/${TLocale}` : `/${TLocale}${TRoute}`
function getRouteWithLocale<TRoute extends string, TLocale extends string = string>(route: TRoute, locale?: TLocale | undefined): Promise<typeof route extends "/" ? `/${TLocale}` : `/${TLocale}${TRoute}`>
function getRouteWithLocale(route: string, locale?: string){
	if(!locale) return getLocale().then(locale => getRouteWithLocale(route, locale))
	return "/" + locale + route
}

export default getRouteWithLocale
