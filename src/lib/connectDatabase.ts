import { connect, type ConnectOptions } from "mongoose"
import "server-only"

declare global {
	var mongoose: {
		connection: null | Awaited<ReturnType<typeof connect>>
		promise: null | ReturnType<typeof connect>
	}
}

const { MONGODB_URI } = process.env

if(!MONGODB_URI) throw "Please define the MONGODB_URI environment variable inside .env.local"

let cached = global.mongoose

cached ||= global.mongoose = {
	connection: null,
	promise: null
}

export default async function connectDatabase(){
	if(cached.connection) return cached.connection

	if(!cached.promise){
		const options: ConnectOptions = {
			dbName: process.env.NODE_ENV
		}

		cached.promise = connect(MONGODB_URI!, options)
	}

	try{
		cached.connection = await cached.promise
	}catch(error){
		cached.promise = null
		throw error
	}

	return cached.connection
}
