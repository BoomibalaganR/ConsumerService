const redis = require('redis')
const logger = require('./logger')
const config = require('./env')

// Create Redis client
const redisClient= redis.createClient({
    url: config.redis.uri
}) 

redisClient.connect()
.then(()=>logger.info('Redis connected successfully'))
.catch((err)=>logger.error(`Redis connection error: ${err}`))

process.on('error', (err)=>{
    logger.error(`Redis connection error: ${err}`)
})
module.exports = redisClient
