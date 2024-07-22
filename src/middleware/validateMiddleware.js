/**
 * Middleware to validate request data against a given schema.
 * 
 * @param {object} schema - Validation schema
 * @returns {function} Middleware function
 */

exports.validate = (schema) => {
    return (req, res, next) => {
        
        const { error, value } = schema.body.validate(req.body)
        if (error) {
            return next(error)
        }   
        
        req.body = value
        next()
    }
}