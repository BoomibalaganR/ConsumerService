const express = require('express')
const { validate } = require('../../middleware/validateMiddleware')

const { citizenshipValidation } = require('../../validations')
const { citizenshipController } = require('../../controllers')
const logger = require('../../../config/logger')

const { cacheMiddleware } = require('../../middleware/cacheMiddleware')

const router = express.Router()

/**
 * Middleware to log consumer route requests.
 * Logs the original URL of incoming requests before passing them to the next middleware.
 */
router.use((req, res, next) => {
	logger.info(`Citizenship route: ${req.originalUrl}`)
	next()
})

// Routes related to citizenship operations
router.get(
	'/:country/affiliations',
	// cacheMiddleware, // Middleware to cache response
	citizenshipController.getCitizenshipAffiliation // Controller function to retrieve citizenship affiliations by country
)

router
	.route('')
	.get(
		// cacheMiddleware, // Middleware to cache response
		citizenshipController.getAllCitizenship // Controller function to retrieve all citizenships
	)
	.post(
		validate(citizenshipValidation.createCitizenship), // Validation middleware for creating citizenship
		citizenshipController.addCitizenship // Controller function to add new citizenship
	)

router
	.route('/:cat')
	.get(
		// cacheMiddleware, // Middleware to cache response
		citizenshipController.getCitizenshipByCategory // Controller function to retrieve citizenship by category
	)
	.put(
		validate(citizenshipValidation.updateCitizenship), // Validation middleware for updating citizenship
		citizenshipController.updateCitizenship // Controller function to update citizenship
	)
	.delete(
		citizenshipController.deleteCitizenship // Controller function to delete citizenship
	)

module.exports = router
