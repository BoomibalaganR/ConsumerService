const express = require('express')
const router = express.Router()

const { relationshipController } = require('../../controllers')
/**
 * Middleware to log consumer route requests.
 * Logs the original URL of incoming requests before passing them to the next middleware.
 */
router.use((req, res, next) => {
	logger.info(`Relationship route: ${req.originalUrl}`)
	next()
})

router.get('', relationshipController.getAllRelationship)

router.post('/request', relationshipController.requestRelationship)
router.post('/accept', relationshipController.acceptRelationship)

module.exports = router
