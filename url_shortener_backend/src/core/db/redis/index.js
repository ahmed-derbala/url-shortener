const redis = require('redis')
const config = require(`../../../config`)

const redisClient = redis.createClient(config.db.redis.options)
redisClient.connect().catch(console.error)
module.exports = redisClient
