
const validatePayload = (Model) => {
    return async (req, res, next) => {
        try {
            const document = new Model(req.body)
            await document.validate()
            next()
        } catch (error) {
            
            if (error.name === 'ValidationError') {
            const formattedErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message,
            }));
            res.status(400).json({ errors: formattedErrors })
            }
            next(error)
        }
    }
  }
  
  module.exports = { validatePayload }
  