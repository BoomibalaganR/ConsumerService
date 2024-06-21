const express = require("express")
const consumerRoutes = require("./consumerRoute")

const router = express.Router()

/**
 * Middleware to handle routes for consumers.
 * This middleware integrates the consumerRoutes module to define routes related to consumers.
 */
router.use(consumerRoutes)

module.exports = router
