const Consumer = require('../models/consumer')
const ApiError = require('../utils/ApiError')
const logger = require('../../config/logger') 
const httpStatus = require('http-status')
const { generateToken } = require('../utils/token')

/**
 * Logs in a consumer by validating the provided credentials.
 * 
 * @param {Object} query - The query object to find the consumer.
 * @param {string} password - The password to validate.
 * @returns {Object} - An object containing error status, token, and consumer data.
 * @throws {ApiError} - If the consumer is not found or the password is incorrect.
 */
exports.login = async (query, password) => {
    const con = await Consumer.findOne(query)
    if (!con) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
    }

    if (!await con.isPasswordMatch(password)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password')
    }

    if (!con.lastlogin) {
        console.log(
            '==========>>>>>> SEND WELCOME EMAIL <<<<<<=========='
        )
    }

    con.lastlogin = Date.now()

    const ctxt = {
        coffer_id: con.coffer_id,
        custom_uid: con.custom_uid,
        first_name: con.first_name,
        last_name: con.last_name,
        email_verified: con.email_verified,
        mobile_verified: con.mobile_verified,
        lastlogin: con.lastlogin,
        email: con.email,
        mobile: con.mob ? con.mob : '',
        pk: con._id,
        password_mode: con.password_mode,
    }

    await con.save()
    logger.info(`${con.first_name} - Login successful`)

    const token = generateToken(ctxt)
    return {
        error: false,
        token: token,
        data: ctxt,
    }
}
