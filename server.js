const app = require("./app")
const logger = require("./src/utils/logger")

app.listen(process.env.PORT || 3000, () => {
	logger.info(`consumer service is running on ${process.env.PORT}`)
})
