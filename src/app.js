const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')

const errorHandler = require("./middleware/errorHandler")
const routesV1 = require("./routes/v1")
const ApiError = require("./utils/ApiError")
const logger = require("../config/logger")
const app = express()



// Enable CORS with specific options
const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))

// Parse JSON request body
app.use(bodyParser.json())

// Routes
app.use("/api/v1/consumers", routesV1)

// Handle unknown routes
app.all("*", (req, res, next) => {
    logger.info(`Can't find ${req.originalUrl} on this server`)
    next(new ApiError(400, `Can't find ${req.originalUrl} on this server`))
})

// Global error handler middleware
app.use(errorHandler)

module.exports = app
