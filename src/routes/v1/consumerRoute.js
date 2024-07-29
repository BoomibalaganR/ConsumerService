const express = require('express')

const { consumerController } = require('../../controllers')
const logger = require('../../../config/logger')

const router = express.Router()

// router.get('/:consumer_id', consumerController.getConsumerById)
module.exports = router
