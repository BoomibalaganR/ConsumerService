const mongoose = require('mongoose')
const { Schema } = mongoose
// const {invalidateMultipleKeys} = require('../middleware/cacheMiddleware')

/**
 * Mongoose schema for Country documents.
 * Represents details related to a country affiliation.
 */
const CountrySchema = new Schema(
	{
		index: { type: String }, // Index or identifier for the country affiliation
		country: { type: String, immutable: true }, // Country name (immutable once set)
		affiliation_type: { type: String }, // Type of affiliation (e.g., primary, secondary)
		work_address: { type: String }, // Work address associated with the affiliation
		home_address: { type: String }, // Home address associated with the affiliation
		mobile_phone: { type: String }, // Mobile phone number associated with the affiliation
		work_phone: { type: String }, // Work phone number associated with the affiliation
		alt_phone: { type: String }, // Alternate phone number associated with the affiliation
		affiliation_countryid: { type: String }, // ID of the country affiliation
	},
	{ _id: false }
) // Disable auto-generation of _id for subdocuments

// CountrySchema.post('findOneAndUpdate', function(doc, next){
//   console.log('hey i am in middleware')
//   if(doc){
//     invalidateMultipleKeys([
//       'consumers/citizenships',
//       `consumers/citizenships/${doc.coffer_id}`
//     ])
//   }
//   next()
// })

module.exports = CountrySchema
