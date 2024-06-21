const logger = require('../utils/logger')
const catchAsync = require('../utils/catchAsync')
const { authRepository } = require('../repository')
const httpStatus = require('http-status')

/**
 * Handles consumer login request.
 * 
 * @param {Object} req - The request object containing payload (email, mobile) for login.
 * @param {Object} res - The response object to send back the login result.
 */
const consumerLogin = catchAsync(async (req, res) => {
    const { email, password } = req.body

    const query = {}
    if (email) {
        query.email = email
    }

    // Log the start of the login attempt
    logger.info(`Login attempt for email: ${email || 'N/A'}}`)

    const data = await authRepository.login(query, password)
    
    res.status(httpStatus.OK).json(data)
})

module.exports = { consumerLogin }
