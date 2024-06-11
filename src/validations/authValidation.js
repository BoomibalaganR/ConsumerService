const Joi = require('joi')


const login ={ 
  
  body:Joi.object({
    action: Joi.string().required().messages({
      'any.required': 'please enter action',
      'string.empty': 'please enter action'
    }),
    email: Joi.string().email().messages({
      'string.email': 'Please enter a valid email.'
    }),
    mobile: Joi.string().pattern(/^\d{10}$/).messages({
      'string.pattern.base': 'Please enter a valid mobile number.'
    }),
    logintype: Joi.string().required().messages({
      'any.required': 'please enter login type',
      'string.empty': 'please enter login type'
    }),
    password: Joi.string().required().messages({
      'any.required': 'please enter password',
      'string.empty': 'please enter password'
    })
  }).or('email', 'mobile').messages({
    'object.missing': 'Either email or mobile must be provided.'
  }).options({ abortEarly: false }) 

}

module.exports = { login}
