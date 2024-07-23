const Joi = require('joi');

exports.createRelationship = {
    body: Joi.object({
        consumerId: Joi.string().hex().length(24).required()
            .messages({
                'string.base': 'Consumer ID should be a type of text',
                'string.hex': 'Consumer ID must be a valid hexadecimal string',
                'string.length': 'Consumer ID must be exactly 24 characters long',
                'any.required': 'Consumer ID is required'
            }),
        description: Joi.string().max(255).required()
            .messages({
                'string.base': 'Description should be a type of text',
                'string.max': 'Description must be at most 255 characters long',
                'any.required': 'Description is required'
            })
    })
}

exports.acceptRelationship = {
    params: Joi.object({
        rel_id: Joi.string().hex().length(24).required()
            .messages({
                'string.base': 'Relationship ID should be a type of text',
                'string.hex': 'Relationship ID must be a valid hexadecimal string',
                'string.length': 'Relationship ID must be exactly 24 characters long',
                'any.required': 'Relationship ID is required'
            })
    })
}

exports.rejectRelationship = this.acceptRelationship
