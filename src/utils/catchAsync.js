/**
 * Wraps an asynchronous function and passes errors to the next middleware.
 * 
 * @param {Function} fun - The asynchronous function to be wrapped.
 * @returns {Function} - A new function that executes the given function and catches any errors.
 */
const catchAsync = (fun) => {
    return (req, res, next) => {
        fun(req, res, next).catch((err) => next(err))
    }
}

module.exports = catchAsync
