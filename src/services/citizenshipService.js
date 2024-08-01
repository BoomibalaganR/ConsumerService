const { Consumer } = require('../models')
const ApiError = require('../utils/ApiError')
const logger = require('../../config/logger')
const httpStatus = require('http-status')
const { AFFILIATIONS, INDIA_AFFILIATIONS } = require('../utils/constants')

/**
 * Retrieves affiliations based on the country.
 *
 * @param {string} country - The country for which affiliations are requested.
 * @returns {Array} - An array of affiliation objects.
 */
exports.getAffiliation = async country => {
	const afl = country === 'India' ? INDIA_AFFILIATIONS : AFFILIATIONS

	const affiliations = []
	for (const [name, type] of Object.entries(afl)) {
		affiliations.push({
			aflType: type,
			aflName: name
		})
	}

	logger.info('Successfully returned affiliations.')
	return affiliations
}

/**
 * Retrieves all citizenships for a consumer.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @returns {Array} - An array of citizenships.
 */
exports.getAllCitizenship = async coffer_id => {
	const projection = { _id: 0, citizen: 1 }
	const citizenships = await Consumer.findOne(
		{ coffer_id: coffer_id },
		projection
	)

	logger.info('Successfully returned all citizenships.')
	return citizenships.citizen
}

/**
 * Retrieves citizenship by category for a consumer.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @param {string} category - The category of citizenship to retrieve.
 * @returns {Object} - The citizenship object.
 * @throws {ApiError} - If the citizenship category is not found.
 */

exports.getCitizenshipByCategory = async (coffer_id, category) => {
	const projection = { _id: 0, 'citizen.$': 1 }
	const citizenships = await Consumer.findOne(
		{ coffer_id: coffer_id, citizen: { $elemMatch: { index: category } } },
		projection
	)

	if (!citizenships) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Citizenship not found.')
	}

	logger.info('Successfully returned citizenship.')
	return citizenships.citizen[0]
}

/**
 * Adds a new citizenship for a consumer.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @param {Object} payload - The citizenship data to add.
 * @returns {Object} - The updated consumer object.
 * @throws {ApiError} - If the consumer is not found or exceeds the citizenship limit.
 */
exports.addCitizenship = async (coffer_id, payload) => {
	const con = await Consumer.findByCofferId(coffer_id)
	if (!con) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const citizenships = con.hasCitizenship()
	if (!citizenships) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Too many citizenships.')
	}

	payload['index'] = citizenships
	con.citizen.push(payload)
	await con.save()

	logger.info('Successfully created citizenship.')
	return con
}

/**
 * Updates an existing citizenship for a consumer.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @param {string} category - The category of citizenship to update.
 * @param {Object} payload - The updated citizenship data.
 * @returns {Object} - The updated consumer object.
 * @throws {ApiError} - If the consumer is not found or the citizenship category is not found.
 */
exports.updateCitizenship = async (coffer_id, category, payload) => {
	const con = await Consumer.findByCofferId(coffer_id)
	if (!con) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const updateFields = {}
	for (const key in payload) {
		updateFields[`citizen.$.${key}`] = payload[key]
	}

	const updatedConsumer = await Consumer.findOneAndUpdate(
		{ coffer_id: coffer_id, 'citizen.index': category },
		{ $set: updateFields },
		{ new: true, runValidators: true }
	)

	if (!updatedConsumer) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			`Citizenship ${category} not found.`
		)
	}

	logger.info(`Successfully updated ${category}`)
	return updatedConsumer
}

/**
 * Deletes a citizenship category for a consumer.
 *
 * @param {string} coffer_id - The unique identifier of the consumer.
 * @param {string} category - The category of citizenship to delete.
 * @returns {void}
 * @throws {ApiError} - If the consumer is not found or attempting to delete the primary affiliation.
 */
exports.deleteCitizenship = async (coffer_id, category) => {
	if (category === 'citizen_primary') {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'Primary affiliation cannot be deleted.'
		)
	}

	const con = await Consumer.findByCofferId(coffer_id)
	if (!con) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const result = await Consumer.updateOne(
		{ coffer_id: coffer_id, 'citizen.index': category },
		{ $pull: { citizen: { index: category } } },
		{ new: true }
	)

	if (result.matchedCount === 0) {
		throw new ApiError(
			httpStatus.NOT_FOUND,
			`Citizenship ${category} not found.`
		)
	}
}
