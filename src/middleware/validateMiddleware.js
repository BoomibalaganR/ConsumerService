/**
 * Middleware to validate request data against a given schema.
 * 
 * @param {object} schema - Validation schema
 * @returns {function} Middleware function
 */

exports.validate = (schema) => {
    return (req, res, next) => {
        const bodyResult = schema.body ? schema.body.validate(req.body) : { error: null, value: req.body }
        const paramsResult = schema.params ? schema.params.validate(req.params) : { error: null, value: req.params }

        if (bodyResult.error) {
            bodyResult.error.name = 'ValidationError'
            bodyResult.error.details = bodyResult.error.details.map(detail => ({
                path: `body.${detail.path.join('.')}`,
                message: detail.message
            }))
            return next(bodyResult.error)
        }

        if (paramsResult.error) {
            paramsResult.error.name = 'ValidationError'
            paramsResult.error.details = paramsResult.error.details.map(detail => ({
                path: `params.${detail.path.join('.')}`,
                message: detail.message
            }))
            return next(paramsResult.error)
        }

        req.body = bodyResult.value
        req.params = paramsResult.value
        next()
    };
};
