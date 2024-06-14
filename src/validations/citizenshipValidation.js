const Joi = require('joi')


exports.createCitizenship ={
  body: Joi.object({
    country: Joi.string()
    .required()
    .messages({
      'string.empty': 'Country is a required field.',
      'any.required': 'Country is a required field.', 
      'string.base': 'country type must be a string.'
    }),
    affiliation_type: Joi.string()
    .required()
    .messages({
      'string.empty': 'Affiliation type is a required field.',
      'any.required': 'Affiliation type is a required field.', 
      'string.base': 'affiliation_type type must be a string.'
    }),
    home_address: Joi.string()
    .required()
    .messages({
      'string.empty': 'Home address is a required field.',
      'any.required': 'Home address is a required field.', 
      'string.base': 'home_address type must be a string.'
    }),
    mobile_phone: Joi.string()
    .required()
    .pattern(new RegExp(/^\d{10}$/))
    .messages({
      'string.empty': 'Mobile phone is a required field.',
      'any.required': 'Mobile phone is a required field.', 
      'string.base': 'mobile_phone type must be a string.',
      'string.pattern.base': 'Mobile phone must be a 10-digit number.'
    }),
    work_address: Joi.string().optional().allow(''),
    work_phone: Joi.string().optional().allow(''),
    alt_phone: Joi.string().optional().allow('')
  }).options({stripUnknown: true, abortEarly: false})
}


exports.updateCitizenship = { 
  body: Joi.object({
    // country: Joi.string().optional().messages({
    //   'string.empty': 'Country cannot be empty if provided.'
    // }),
    affiliation_type: Joi.string().optional().messages({
      'string.empty': 'Affiliation type cannot be empty.', 
      'string.base': 'affiliation_type type must be a string.'
    }),
    home_address: Joi.string().optional().messages({
      'string.empty': 'Home address cannot be empty.', 
      'string.base': 'home_address type must be a string.'
    }),
    mobile_phone: Joi.string()
    .optional()
    .pattern(new RegExp(/^\d{10}$/))
    .messages({
      'string.empty': 'Mobile phone cannot be empty.',
      'string.base': 'mobile_phone type must be a string.',
      'string.pattern.base': 'Mobile phone must be a 10-digit number.'
    }),
    work_address: Joi.string().optional().allow(''),
    work_phone: Joi.string().optional().allow(''),
    alt_phone: Joi.string().optional().allow('')
  }).options({stripUnknown: true, abortEarly: false})

}