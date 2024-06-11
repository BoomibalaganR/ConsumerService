const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcryptjs") 
const CountrySchema = require('./country')



const ConsumerSchema = new Schema(
	{
		coffer_id: {
			type: String,
			unique: true,
		},
		first_name: {
			type: String,
			required: [true, "First name is required"],
		},
		middle_name: {
			type: String,
		},
		last_name: {
			type: String,
			required: [true, "Last name is required"],
		},
		country: {
			type: String,
			required: [true, "Country is required"],
		},
		gender: { type: String },
		password: {
			type: String,
			required: [true, "Password is required"],
		},

		confirm_password: { type: String },
		password_reset_token: { type: String },
		password_reset_timestamp: { type: Date },
		password_mode: { type: String },

		lastlogin: { type: Date },
		dob: { type: Date },
		email: {
			type: String,
			required: [true, "Email is required"],
		},
		mobile: { type: String },
		email_verified: { type: Boolean, default: false },
		mobile_verified: { type: Boolean, default: false },
		email_verification_token: { type: String },
		mobile_verification_token: { type: String },
		citizen: { type: [CountrySchema] },
	},
	{ timestamps: { createdAt: "joined" } }
) 



//create custom uid from email
ConsumerSchema.virtual("custom_uid").get(function () {
	return this.email.replace(/\./g, "").replace(/@/g, "")
}) 

ConsumerSchema.methods.isPasswordMatch = async function (password) {
	return await bcrypt.compare(password, this.password)
} 

ConsumerSchema.methods.hasCitizenship =  function(){ 
    const citizens = this.citizen
    const citizenships = ['citizen_primary','citizen_second','citizen_third', 'citizen_fourth']

    for(const citizen of citizens){
        const index= citizenships.indexOf(citizen.index) 
        if (index!=-1){
            citizenships.splice(index, 1)
        }
    }   
    console.log(citizenships)
    if (citizenships.length) return citizenships[0]
} 


// Before saving the user to the database, hash the password
ConsumerSchema.pre("save", async function (next) { 
	if (!this.isModified('password')) return next()
	try {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(this.password, salt)
		this.password = hashedPassword
		next()
	} catch (error) {
		next(error)
	}
})



module.exports = mongoose.model("Consumer", ConsumerSchema)

