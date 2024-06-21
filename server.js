const app = require("./app") // Importing the Express application instance
const logger = require("./src/utils/logger") // Importing the logger utility

// Start the Express application server
app.listen(process.env.PORT || 3000, () => {
    logger.info(`consumer service is running on ${process.env.PORT || 3000}`)
})
