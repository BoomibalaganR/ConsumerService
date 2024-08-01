const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')
const { citizenshipService } = require('../services')
// const { invalidateMultipleKeys } = require('../middleware/cacheMiddleware')

/**
 * Retrieves all citizenships associated with the authenticated user's coffer_id.
 *
 * @param {Object} req - The request object containing user information (req.user).
 * @param {Object} res - The response object to send back the retrieved citizenship data.
 */
exports.getAllCitizenship = catchAsync(async (req, res) => {
	const coffer_id = req.user.coffer_id
	const data = await citizenshipService.getAllCitizenship(coffer_id)
	res.status(httpStatus.OK).json(data)
})

/**
 * Retrieves citizenship information by a specific category for the authenticated user's coffer_id.
 *
 * @param {Object} req - The request object containing user information (req.user) and category (req.params.cat).
 * @param {Object} res - The response object to send back the retrieved citizenship data.
 */
exports.getCitizenshipByCategory = catchAsync(async (req, res) => {
	const coffer_id = req.user.coffer_id
	const category = req.params.cat
	const data = await citizenshipService.getCitizenshipByCategory(
		coffer_id,
		category
	)
	res.status(httpStatus.OK).json(data)
})

/**
 * Adds a new citizenship entry for the authenticated user's coffer_id.
 *
 * @param {Object} req - The request object containing user information (req.user) and citizenship data (req.body).
 * @param {Object} res - The response object to send back the result of adding the citizenship.
 */
exports.addCitizenship = catchAsync(async (req, res) => {
	const coffer_id = req.user.coffer_id
	const data = await citizenshipService.addCitizenship(coffer_id, req.body)
	res.status(httpStatus.OK).json(data)
})

/**
 * Updates an existing citizenship entry identified by category for the authenticated user's coffer_id.
 *
 * @param {Object} req - The request object containing user information (req.user),
 *                       category (req.params.cat), and updated citizenship data (req.body).
 * @param {Object} res - The response object to send back the updated citizenship data.
 */
exports.updateCitizenship = catchAsync(async (req, res) => {
	const coffer_id = req.user.coffer_id
	const category = req.params.cat
	const data = await citizenshipService.updateCitizenship(
		coffer_id,
		category,
		req.body
	)
	//to invalidate cache
	// invalidateMultipleKeys(['/consumers/citizenship', `${req.originalUrl}`])
	res.status(httpStatus.OK).json(data)
})

/**
 * Deletes a citizenship entry identified by category for the authenticated user's coffer_id.
 *
 * @param {Object} req - The request object containing user information (req.user) and
 *                       category (req.params.cat) of the citizenship to delete.
 * @param {Object} res - The response object to send back the result of deleting the citizenship.
 */
exports.deleteCitizenship = catchAsync(async (req, res) => {
	const coffer_id = req.user.coffer_id
	const category = req.params.cat

	const data = await citizenshipService.deleteCitizenship(coffer_id, category)

	//to invalidate cache
	// invalidateMultipleKeys(['/consumers/citizenship', `${req.originalUrl}`])
	res.status(httpStatus.OK).json(data)
})

/**
 * Retrieves affiliation information based on the specified country.
 *
 * @param {Object} req - The request object containing the country parameter (req.params.country).
 * @param {Object} res - The response object to send back the retrieved affiliation data.
 */
exports.getCitizenshipAffiliation = catchAsync(async (req, res) => {
	const country = req.params.country
	const data = await citizenshipService.getAffiliation(country)
	res.status(httpStatus.OK).json(data)
})
