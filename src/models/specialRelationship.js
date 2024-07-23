const mongoose = require('mongoose')
const { Schema } = mongoose

// Define the consumer to consumer Relationship schema
const SpecialRelationshipSchema = new Schema({
	requestor_uid: {
		type: String,
		required: true, // The unique ID of the requestor
	},
	requestor_type: {
		type: String,
		required: true,
		default: 'consumer',
	},
	requestor_group_acls: {
		type: [String], // Access control list for requestor
	},
	requestor_tags: {
		type: [String],
		default: ['personal'], // Tags for requestor
	},

	acceptor_uid: {
		type: String,
		required: true, // The unique ID of the acceptor
	},
	acceptor_type: {
		type: String,
		required: true,
		default: 'consumer',
	},
	acceptor_tags: {
		type: [String],
		default: ['personal'], // Tags for acceptor
	},
	accepted_date: {
		type: Date, // Date when the request was accepted 
		immutable: true
	},
	acceptor_group_acls: {
		type: [String], // Access control list for acceptor
	},
	isaccepted: {
		type: Boolean,
		default: false, // Whether the request is accepted
	},
	status: {
		type: String, // Status of the relationship
		enum: ['accepted', 'requested', 'rejected'],
		default: 'requested',
	},
	description: {
		type: String, // Description of the relationship
	},
	reject_reason: {
		type: String, // Reason for rejection, if any
	},
	created: {
		type: Date,
		default: Date.now, // Creation date
	},
	tcfilename: {
		type: String, // Filename for terms and conditions
	},
})

// Export the model
module.exports = mongoose.model(
	'SpecialRelationship',
	SpecialRelationshipSchema
)
