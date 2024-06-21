/**
 * Custom API Error class extending the base Error class.
 * 
 * @class ApiError
 * @extends {Error}
 */
class ApiError extends Error {
    /**
     * Creates an instance of ApiError.
     * 
     * @param {number} statusCode - The HTTP status code for the error.
     * @param {string} message - The error message.
     */
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
    }
}

module.exports = ApiError
