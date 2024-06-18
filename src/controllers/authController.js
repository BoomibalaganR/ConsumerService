const logger = require("../utils/logger") 
const catchAsync = require('../utils/catchAsync') 

const {authRepository} = require('../repository') 
const httpStatus = require('http-status')


const consumerLogin = catchAsync(async (req, res) => {
	const payload = req.body

	const query = {}
	if (payload["email"]) {
		query["email"] = payload["email"]
	} 

	// Log the start of the login attempt
	logger.info(
		`Login attempt for email: ${payload.email || "N/A"}, mobile: ${
			payload.mobile || "N/A"}`)  
			
	const data = await authRepository.login(query, payload['password'])    
	
	res.status(httpStatus.OK).json(data)
})


module.exports = { consumerLogin }
