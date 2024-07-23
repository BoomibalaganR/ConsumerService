const express = require('express')
const citizenshipRoute = require('./citizenshipRoute')
const relationshipRoute = require('./relationshipRoute')

const { authValidation } = require('../../validations')
const { authController } = require('../../controllers')
const { authenticateToken } = require('../../middleware/authMiddleware')

const { validate } = require('../../middleware/validateMiddleware')

const router = express.Router()

/**
 * Middleware to handle routes for consumers.
 * This middleware integrates the consumerRoutes module to define routes related to consumers.
 */

// Endpoint for user login
router.route('/login').post(
	validate(authValidation.login), // Validation middleware for login request
	authController.consumerLogin // Controller function to handle consumer login
)

// Middleware to authenticate JWT token for all endpoints below
router.use(authenticateToken)

router.use('/citizenship', citizenshipRoute)
router.use('/relationships', relationshipRoute)

module.exports = router
