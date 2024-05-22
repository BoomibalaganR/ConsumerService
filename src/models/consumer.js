const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')



// schema for Country
const CountrySchema = new Schema({
  index: { type: String },
  country: { type: String },
  affiliation_type: { type: String },
  work_address: { type: String },
  home_address: { type: String },
  mobile_phone: { type: String },
  work_phone: { type: String },
  alt_phone: { type: String },
  affiliation_countryid: { type: String },
}); 


const ConsumerSchema = new Schema({
  coffer_id: { 
    type: String, 
    unique: true 
  },
  first_name: { 
    type: String, 
    required: [true, 'First name is required']
  },
  middle_name: { 
    type: String
  },
  last_name: { 
    type: String,
    required: [true, 'Last name is required']
  },
  country: { 
    type: String,
    required: [true, 'Country is required']
  },
  gender: { type: String },
  password: { 
    type: String,
    required: [true, 'Password is required']
  },

  confirm_password: { type: String },
  password_reset_token: { type: String },
  password_reset_timestamp: { type: Date },
  password_mode: { type: String },
 
  lastlogin: { type: Date },
  dob: { type: Date },
  email: { 
    type: String,  
    required: [true, 'Email is required']
  },
  mobile: { type: String },
  email_verified: { type: Boolean, default: false },
  mobile_verified: { type: Boolean,  default: false },
  email_verification_token: { type: String },
  mobile_verification_token: { type: String },
  citizen: { type: [CountrySchema] },
}, {timestamps: {createdAt: 'joined'}})


//create custom uid from email
ConsumerSchema.virtual('custom_uid').get(function() {
  return this.email.replace(/\./g, '').replace(/@/g, '')
})



// Before saving the user to the database, hash the password
ConsumerSchema.pre('save', async function(next) {
  
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
      next()

    } catch (error) {
      next(error)
    }
  })
  

module.exports =  mongoose.model('Consumer', ConsumerSchema)
