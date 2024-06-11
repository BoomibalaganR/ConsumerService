const ApiError = require("../utils/ApiError")
const httpStatus = require("http-status")  
const logger = require('../utils/logger') 


module.exports = (err, req, res, next) => {
	if (err.name === "ValidationError") {
		const messages = []

		if (err.details) {
			if (err.details.body) {
				messages.push(
					...err.details.body.map((detail) => detail.message)
				)
			}
			if (err.details.query) {
				messages.push(
					...err.details.query.map((detail) => detail.message)
				)
			}
			if (err.details.params) {
				messages.push(
					...err.details.params.map((detail) => detail.message)
				)
			}
		}
		res.status(err.statusCode).json({ errors: messages })
	} else if (err instanceof ApiError) { 
		logger.info(err.message)
		console.error(err.stack)
		res.status(err.statusCode).json({ error: true, message: err.message })
	} else { 
		logger.info(err.message)
		console.error(err.stack)
		res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			error: true,
			message: "Internal Server Error",
		})
	}
}
