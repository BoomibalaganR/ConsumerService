const httpStatus = require('http-status')
const { Consumer } = require('../models')
const ApiError = require('../utils/ApiError')

/**
 * Retrieves a consumer from the database based on the coffer_id.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @returns {Promise<Object|null>} - A promise that resolves to the consumer object if found,
 *                                   or null if not found.
 */
// exports.getConsumerByCoffer_id = async coffer_id => {
// 	const con = await Consumer.findOne({ coffer_id: coffer_id })
// 	return con
// }

// exports.getConsumerById = async id => {
// 	const con = await Consumer.findById(id)
// 	if (!con) {
// 		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
// 	}
// 	return con
// }
