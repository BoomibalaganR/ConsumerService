const express = require("express")
const consumerRoutes = require("./consumerRoute")

const router = express.Router()



// route to consumerRoutes
router.use(consumerRoutes) 




module.exports = router
