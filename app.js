const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require('cors')

const errorMiddleware = require("./src/middleware/errorMiddleware")
const routes = require("./src/routes/v1")
const ApiError = require("./src/utils/ApiError")
const logger = require("./src/utils/logger")
const app = express()

dotenv.config({ path: "./config.env" })

// Connect to MongoDB
mongoose
    .connect(process.env.CLOUD_DB_URI)
    .then(() => logger.info("Database connected successfully"))
    .catch((err) => logger.info(`Something went wrong with MongoDB connection: ${err.message}`))

// Enable CORS with specific options
const corsOptions = {
    origin: 'https://editor.swagger.io'
}
app.use(cors(corsOptions))

// Parse JSON request body
app.use(bodyParser.json())

// Routes
app.use("/consumers", routes)

// Handle unknown routes
app.all("*", (req, res, next) => {
    logger.info(`Can't find ${req.originalUrl} on this server`)
    next(new ApiError(400, `Can't find ${req.originalUrl} on this server`))
})

// Global error handler middleware
app.use(errorMiddleware)

module.exports = app
