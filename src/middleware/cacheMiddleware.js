const redisClient = require('../../config/redis')
const zlib = require('zlib')
const util = require('util')
const logger = require('../../config/logger')   
const config = require('../../config/env')


// Promisify zlib functions
const deflate = util.promisify(zlib.deflate)
const inflate = util.promisify(zlib.inflate) 

//cache expire 
const CACHE_EXPIRE = config.cache.expire

exports.cacheMiddleware = async (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}:${req.user.coffer_id}`
    console.log('Generated key:', key)
	// console.log(redisClient.isOpen)
    if(redisClient.isOpen){
		try { 
			const cachedData = await redisClient.get(key)

			if (cachedData) {
				console.log('Cache hit:', key)

				const decompressedData = await inflate(Buffer.from(cachedData, 'base64'))
				const jsonString = decompressedData.toString()
				const parsedData = JSON.parse(jsonString)

				return res.json(parsedData)
			}

			console.log('Cache miss:', key)

			// Override res.send for caching the response
			res.jsonResponse = res.send
			res.send = async (data) => {
				const compressedData = await deflate(data)
				await redisClient.setEx(key, CACHE_EXPIRE, compressedData.toString('base64'))

				res.jsonResponse(data);
			}
			
			// next()
		} catch (error) {
			logger.info(`Error accessing Redis: ${error}`)
			// Proceed without caching if something wrong on redis server
			// next()
		} 
    } 
    next()
}


// Function to invalidate single key
exports.invalidateCache = (key) => { 
  console.log('cache-deleted-key', key)
  redisClient.del(`cache:GET:${key}`, (err, response) => {
    if (response === 1) {
      console.log(`Cache invalidated for key: ${key}`);
    } else {
      console.log(`Cache not found for key: ${key}`);
    }
  })
}

// Function to invalidate multiple keys
exports.invalidateMultipleKeys = (keys) => {
  keys.forEach((key) => invalidateCache(key))
}

