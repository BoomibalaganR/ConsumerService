const { createLogger, format, transports } = require("winston")
const { combine, timestamp, printf, colorize } = format

// custom log format
const customFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`
})

// Create the logger instance
const logger = createLogger({
	level: "info",
	format: combine(timestamp(), colorize(), customFormat),
	transports: [
		new transports.Console(), // Log to the console
		// new transports.File({ filename: 'app.log' }) // Log to a file
	],
})

module.exports = logger
