import { connect, type ConnectOptions } from "mongoose"

declare global {
	var mongoose: {
		connection: null | Awaited<ReturnType<typeof connect>>
		promise: null | ReturnType<typeof connect>
	}
}

const { DATABASE_NAME, MONGODB_URI, NODE_ENV } = process.env

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
			writeConcern: {
				w: "majority"
			},
			retryWrites: true,
			bufferCommands: false,
			dbName: DATABASE_NAME || NODE_ENV
		}

		cached.promise = connect(MONGODB_URI!, options)
			.then(mongoose => {
				mongoose.set("debug", process.env.NODE_ENV === "development")
				return mongoose
			})
	}

	try{
		cached.connection = await cached.promise
	}catch(error){
		cached.promise = null
		throw error
	}

	return cached.connection
}
