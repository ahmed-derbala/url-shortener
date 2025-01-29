/**
 * the default config.js
 */
const packagejson = require(`../../package.json`)
const os = require('os')
const ip = require('ip')
const fs = require('fs')

const backend = {
	port: process.env.PORT || 5001,
	host: `${ip.address()}`,
	protocol: 'http://',
	get url() {
		return `${this.protocol}${this.host}:${this.port}`
	}
}

/**
 * app
 */
let app = {
	name: packagejson.name,
	version: packagejson.version,
	description: packagejson.description,
	author: packagejson.author,
	swagger: {
		endpoint: '/swagger',
		get url() {
			return `${backend.url}${this.endpoint}`
		}
	},
	cluster: 0, //os.cpus().length,//a number, 0 to disable
	responseTimeAlert: 20000, //time in ms before considering a request timeout
	apiLimiter: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false // Disable the `X-RateLimit-*` headers
	},
	corsOptions: {
		origin: '*',
		//methods: "GET,PUT,POST,DELETE,PATCH",
		credentials: true
	},
	helmet: {
		isActive: false,
		options: {
			crossOriginResourcePolicy: false
		}
	},
	views: false
}

/**
 * db
 */
const user = null
const password = null
const host = process.env.DATABASE_HOST || '127.0.0.1'
const port = parseInt(process.env.DATABASE_PORT, 10) || 27017
const name = packagejson.name
const maxPoolSize = 200 //number > 0 otherwise ignored, default 200, more infos: https://mongoosejs.com/docs/connections.html#connection_pools
const minPoolSize = 5 //number > 0 otherwise ignored, default 5, more infos: https://mongoosejs.com/docs/connections.html#connection_pools
let uri = 'mongodb+srv://ahmed:derbala@free-cluster.b92wx.mongodb.net/?retryWrites=true&w=majority&appName=free-cluster'

let db = {
	primary: 'mongodb',
	mongodb: {
		isActive: true,
		host,
		port,
		name,
		uri,
		connectionName: name,
		options: {
			maxPoolSize,
			minPoolSize
		}
	},
	redis: {
		options: {
			port: 5000,
			legacyMode: true,
			url: 'redis://default:rNfIsJ59qaKkYKiYhdaOnGKj2InL2nZC@redis-14122.c246.us-east-1-4.ec2.redns.redis-cloud.com:14122'
		}
	}
}

/**
 * log
 */
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint, colorize } = format
require('winston-mongodb')

const transportsOptions = {
	file: {
		level: 'startup', //the level to start logging to file
		filename: `${process.cwd()}/logs/${app.name}-${app.version}.log`,
		handleExceptions: true,
		maxsize: 250_000, //1 million = 1 mb
		maxFiles: 2,
		decolorize: true,
		json: true,
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD--HH:mm:ss.SSS'
			})
		)
	},
	console: {
		level: 'startup', //the level to start logging to console
		json: true,
		handleExceptions: true,
		format: format.combine(
			format.timestamp({
				format: 'YYYY-MM-DD--HH:mm:ss.SSS'
			}),
			format.json(),
			prettyPrint(), //print every json key in a seperate row for clearer reading. comment to print log on a single line
			colorize({ all: true }) //this must be always called at the end to make sure of colors
		)
	},
	mongo: {
		level: 'startup', //the level to start logging to mongodb
		db: db.mongodb.uri,
		options: {},
		decolorize: true,
		expireAfterSeconds: 360000, //100 hours
		collection: `logs`,
		format: format.metadata()
	}
}

const levelsPriority = {
	error: 0,
	warn: 1,
	verbose: 2,
	socket: 3,
	debug: 4,
	success: 5,
	startup: 6,
	shutdown: 7
}

const levelsNames = {
	error: 'error',
	warn: 'warn',
	verbose: 'verbose',
	socketio: 'socketio',
	debug: 'debug',
	success: 'success',
	startup: 'startup',
	shutdown: 'shutdown'
}

const defaultConfig = {
	NODE_ENV: process.env.NODE_ENV || 'local',
	app,
	backend,
	frontend: {
		port: 3000,
		host: `${ip.address()}`,
		protocol: 'http://',
		/*get url() {
			return `${this.protocol}${this.host}:${this.port}`
		}*/
		url: 'http://localhost:3000'
	},
	auth: {
		saltRounds: 10,
		jwt: {
			privateKey: packagejson.name,
			expiresIn: '90d'
		}
	},
	db,
	log: {
		kind: 'winston', //winston, simple
		reqDefaultLog: 'morgan_log',
		isActive: true,
		createLoggerOptions: {
			transports: [
				//comment or delete transports you dont want to use
				new transports.File(transportsOptions.file),
				new transports.Console(transportsOptions.console),
				new transports.MongoDB(transportsOptions.mongo)
			],
			levels: levelsPriority,
			exitOnError: false,
			silent: false //silent all transports
		},
		transportsOptions,
		levels: {
			isActive: true, //level item
			priority: levelsPriority,
			colors: {
				error: 'black redBG',
				warn: 'black yellowBG',
				verbose: 'black greenBG',
				socket: 'magenta',
				debug: 'white',
				success: 'green',
				startup: 'white blueBG'
			},
			names: levelsNames,
			allowed: [levelsNames.error, levelsNames.warn, levelsNames.verbose, levelsNames.socketio, levelsNames.debug, levelsNames.success, levelsNames.startup, levelsNames.shutdown]
		},
		label: {
			isActive: true
		},
		req: {
			isActive: true,
			headers: {
				isActive: true,
				tid: {
					isActive: true
				},
				token: {
					isActive: false
				}
			}
		},
		memory: {
			isActive: true,
			unit: 1000000000 //1000000000=GB,1000000=MB
		},
		error: {
			isActive: true
		},
		caller: {
			isActive: true
		},
		data: {
			isActive: true
		},
		morgan: {
			//more infos: https://www.npmjs.com/package/morgan
			tokenString: `{"status"::status,"method":":method", "originalUrl":":originalUrl", "user"::user ,"body"::body, "ip":":ip","headers"::headers ,"responseTime"::response-time}`,
			//tokenString: `{"status"::status,"method":":method", "originalUrl":":originalUrl", "user": :user ,"body": :body, "ip": :ip, "headers": :headers ,"responseTime"::response-time,"browser":":browser", "os":":os", "platform":":platform" ,"origin":":origin", "isBot":":isBot", "referrer":":referrer"}`,
			hiddenBodyFields: ['password', 'user.password'] //[] for none, display these keys as *** in terminal
		}
	},
	pagination: {
		minLimit: 1,
		defaultLimit: 100, //limit to use when no limit is provided
		maxLimit: 300
	},
	socketio: {
		options: {
			cors: {
				origin: '*',
				//origin: ['http://127.0.0.1:3666', 'http://localhost:3666'],
				credentials: true,
				method: ['GET', 'POST'],
				transports: ['websocket', 'polling']
			},
			allowEIO3: true
		}
	},
	users: {
		roles: ['admin', 'user'],
		types: ['type1', 'type2']
	}
}

//loading envirment config file if exists
let envConfig = {}
if (process.env.NODE_ENV) {
	const envFilePath = `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`
	if (fs.existsSync(envFilePath)) {
		envConfig = require(envFilePath)
	} else {
		fs.copyFileSync(`${process.cwd()}/src/config/index.js`, `${process.cwd()}/src/config/${process.env.NODE_ENV}.config.js`)
	}
}

module.exports = { ...defaultConfig, ...envConfig }
