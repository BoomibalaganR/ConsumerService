const mongoose = require("mongoose");
const { Schema } = mongoose;

const CountrySchema = new Schema({
  index: { type: String },
  country: { type: String, immutable: true },
  affiliation_type: { type: String },
  work_address: { type: String },
  home_address: { type: String },
  mobile_phone: { type: String },
  work_phone: { type: String },
  alt_phone: { type: String },
  affiliation_countryid: { type: String },
}, { _id: false })


module.exports =  CountrySchema
