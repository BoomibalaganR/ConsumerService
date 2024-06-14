const jwt = require('jsonwebtoken') 

const ApiError = require("../utils/ApiError") 
const logger = require('../utils/logger')
const httpStatus = require('http-status')


const SECRET_KEY = process.env.JWT_SECRET_KEY 

const authenticateToken= (req, res, next) => {   
   
    // get token from Authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // If token is missing, return unauthorized
    if (!token) return next(new ApiError(httpStatus.UNAUTHORIZED, 'UnAuthorized'))
    
    // Verify token
    jwt.verify(token, SECRET_KEY, (err, decoded) => { 
    
        // If fail, return unauthorized
        if (err) {
            if (err.name === 'TokenExpiredError') { 
                return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired'))
            } 
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token'))
        }
        
        //if authenticated, add coffer_id into request
        req.user = decoded  
        logger.info(`successfully authenticate`)
        next()
    })
}

module.exports = { authenticateToken }
