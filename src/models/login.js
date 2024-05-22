const mongoose = require('mongoose')
const { Schema } = mongoose
 


const loginSchema = new Schema({
  action: {
    type: String,
    required: [ true,"please enter action "]
  },

  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email.']
  },
  mobile: {
    type: String,
    match: [/^\d{10}$/, 'Please enter a valid mobile number.']
  },

  logintype: {
    type: String,
    required:[ true,"please enter login type."]
  },

  password: {
    type: String,
    required: [ true,"please enter password."]
  }
}, { autoCreate: false, autoIndex: false })


// to check it contain, either email or mobile
loginSchema.pre('validate', function(next) {
  if (!this.email && !this.mobile) {
    this.invalidate('email', 'Either email or mobile must be provided.')
  }
  next()
})



const LoginModel = mongoose.model("Login", loginSchema)

module.exports = { LoginModel }