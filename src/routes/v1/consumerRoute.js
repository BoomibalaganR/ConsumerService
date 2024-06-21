const express = require('express')
const { validate } = require('express-validation')

const { citizenshipValidation, authValidation } = require('../../validations')
const { authController, citizenshipController } = require('../../controllers')
const logger = require('../../utils/logger')

const { authenticateToken } = require('../../middleware/authMiddleware')
const cacheMiddleware = require('../../middleware/cacheMiddleware')

const router = express.Router()

/**
 * Middleware to log consumer route requests.
 * Logs the original URL of incoming requests before passing them to the next middleware.
 */
router.use((req, res, next) => {
    logger.info(`Consumer route: ${req.originalUrl}`)
    next()
})

// Endpoint for user login
router.route('/login')
    .post(
        validate(authValidation.login), // Validation middleware for login request
        authController.consumerLogin    // Controller function to handle consumer login
    )

// Middleware to authenticate JWT token for all endpoints below
router.use(authenticateToken)

// Routes related to citizenship operations
router.get(
    '/citizenship/:country/affiliations',
    cacheMiddleware, // Middleware to cache response
    citizenshipController.getCitizenshipAffiliation // Controller function to retrieve citizenship affiliations by country
)

router.route('/citizenship')
    .get(
        citizenshipController.getAllCitizenship // Controller function to retrieve all citizenships
    )
    .post(
        validate(citizenshipValidation.createCitizenship), // Validation middleware for creating citizenship
        citizenshipController.addCitizenship // Controller function to add new citizenship
    )

router.route('/citizenship/:cat')
    .get(
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
