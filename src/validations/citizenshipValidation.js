const Joi = require('joi')

/**
 * Validation schema for creating citizenship.
 * Validates the request body fields for creating a new citizenship entry.
*/
exports.createCitizenship = {
	body: Joi.object({
		country: Joi.string()
		.required()
		.messages({
			'string.empty': 'Country is a required field.',
			'any.required': 'Country is a required field.',
			'string.base': 'Country must be a string.'
		}),
		affiliation_type: Joi.string()
		.required()
		.messages({
			'string.empty': 'Affiliation type is a required field.',
			'any.required': 'Affiliation type is a required field.',
			'string.base': 'Affiliation type must be a string.'
		}),
		home_address: Joi.string()
		.required()
		.messages({
			'string.empty': 'Home address is a required field.',
			'any.required': 'Home address is a required field.',
			'string.base': 'Home address must be a string.'
		}),
		mobile_phone: Joi.string()
		.required()
		.pattern(new RegExp(/^\d{10}$/))
		.messages({
			'string.empty': 'Mobile phone is a required field.',
			'any.required': 'Mobile phone is a required field.',
			'string.base': 'Mobile phone must be a string.',
			'string.pattern.base': 'Mobile phone must be a 10-digit number.'
		}),
		work_address: Joi.string().optional().allow(''),
		work_phone: Joi.string().optional().allow(''),
		alt_phone: Joi.string().optional().allow('')
	}).options({ stripUnknown: true, abortEarly: false })
}

/**
 * Validation schema for updating citizenship.
 * Validates the request body fields for updating an existing citizenship entry.
 */
exports.updateCitizenship = {
	body: Joi.object({
		affiliation_type: Joi.string().optional().messages({
		'string.empty': 'Affiliation type cannot be empty.',
		'string.base': 'Affiliation type must be a string.'
		}),
		home_address: Joi.string().optional().messages({
		'string.empty': 'Home address cannot be empty.',
		'string.base': 'Home address must be a string.'
		}),
		mobile_phone: Joi.string()
		.optional()
		.pattern(new RegExp(/^\d{10}$/))
		.messages({
			'string.empty': 'Mobile phone cannot be empty.',
			'string.base': 'Mobile phone must be a string.',
			'string.pattern.base': 'Mobile phone must be a 10-digit number.'
		}),
		work_address: Joi.string().optional().allow(''),
		work_phone: Joi.string().optional().allow(''),
		alt_phone: Joi.string().optional().allow('')
	}).options({ stripUnknown: true, abortEarly: false })
}
