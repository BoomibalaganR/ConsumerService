const redis = require('redis');
const zlib = require('zlib');
const util = require('util');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

// Promisify zlib functions
const deflate = util.promisify(zlib.deflate);
const inflate = util.promisify(zlib.inflate);

// Create Redis client
const redisClient = redis.createClient({
    url: process.env.REDIS_URI
});

redisClient.connect()
    .then(() => logger.info("redis connected successfully"))
    .catch((err) => logger.info(`something wrong ${err.message}`));

// Cache middleware
const cacheMiddleware = catchAsync(async (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}:${req.user.coffer_id}`;
    console.log('Generated key:', key);
    const cachedData = await redisClient.get(key);
    // console.log(cachedData)

    if (cachedData) {
        console.log('Cache hit:', key)

        const decompressedData = await inflate(Buffer.from(cachedData, 'base64'))
        const jsonString = decompressedData.toString()
        const parsedData = JSON.parse(jsonString)
    
        return res.json(parsedData)
    }

    console.log('Cache miss:', key)

    // Override res.send for cache the response
    res.jsonResponse = res.send
    res.send = async (data) => { 
        const compressedData = await deflate(data)
        await redisClient.setEx(key, 30, compressedData.toString('base64'))
        
        res.jsonResponse(data)
    }
    next()
})

module.exports = cacheMiddleware
