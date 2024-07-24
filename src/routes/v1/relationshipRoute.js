const express = require('express')
const router = express.Router()

const { validate } = require('../../middleware/validateMiddleware')
const { relationshipValidation } = require('../../validations')
const { relationshipController } = require('../../controllers')
const logger = require('../../../config/logger')
/**
 * Middleware to log consumer route requests.
 * Logs the original URL of incoming requests before passing them to the next middleware.
 */
router.use((req, res, next) => {
	logger.info(`Relationship route: ${req.originalUrl}`)
	next()
})

router.get('', relationshipController.getAllRelationship)
router.get('/search/consumer', relationshipController.getAllConsumer)

router.post(
	'/request',
	validate(relationshipValidation.createRelationship),
	relationshipController.requestRelationship
)
router.post(
	'/:rel_id/accept',
	validate(relationshipValidation.acceptRelationship),
	relationshipController.acceptRelationship
)
router.post(
	'/:rel_id/reject',
	validate(relationshipValidation.rejectRelationship),
	relationshipController.rejectRelationship
)

module.exports = router
