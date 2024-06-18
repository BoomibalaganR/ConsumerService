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


// const uri = process.env.LOCAL_DB_URI 
const uri = process.env.CLOUD_DB_URI

// connect to mongoDB
mongoose
	.connect(uri)
	.then(() => logger.info("database connected successfully"))
	.catch((err) => logger.info(`something wrong ${err.message}`))


const corsOptions = {
	origin: 'https://editor.swagger.io'
}
app.use(cors(corsOptions))

app.use(bodyParser.json())




app.use("/consumers", routes)


app.all("*", (req, res, next) => {
	logger.info(`Can't find ${req.originalUrl} on this server`)
	next(new ApiError(400, `Can't find ${req.originalUrl} on this server`))
})


// Handle the error GLOBALLY
app.use(errorMiddleware)

module.exports = app
