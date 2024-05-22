const ApiError  = require('../utils/ApiError')


module.exports = (err, req, res, next) => { 
    if (err instanceof ApiError ) {  
        console.error(err.stack)
        res.status(err.statusCode).json({ error: true, message: err.message})
    } else {
        console.error(err.stack)
        res.status(500).json({error: true, message: 'Internal Server Error' })
    }
}
