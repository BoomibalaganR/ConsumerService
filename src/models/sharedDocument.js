const mongoose = require('mongoose')
const { Schema } = mongoose

// Define the SharedDocument schema
const SharedDocumentSchema = new Schema({
	// b2brelationship: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'B2BRelationship'
	// },
	// relationship: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Relationship'
	// },
	relationship_id: {
		type: String
	},
	// docref: {
	// 	type: Schema.Types.Mixed,
	// 	refPath: 'relationship_type'
	// },
	relationship_type: {
		type: String
	},
	shared_with: {
		type: String
	},
	shared_by: {
		type: String
	},
	docid: {
		type: String
	},
	doctype: {
		type: String
	},
	docversion: {
		type: String
	},
	shared_type: {
		type: String,
		enum: ['PRIV', 'PUBLIC']
	},
	matters: {
		type: [Schema.Types.Mixed]
	}
})

module.exports = mongoose.model('SharedDocument', SharedDocumentSchema)
