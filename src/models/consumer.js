const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')
const CountrySchema = require('./country')

/**
 * Mongoose schema for the Consumer collection.
 * Represents a consumer entity in the database.
 */
const ConsumerSchema = new Schema(
	{
		coffer_id: {
			type: String,
			unique: true,
		},
		first_name: {
			type: String,
			required: [true, 'First name is required'],
		},
		middle_name: {
			type: String,
		},
		last_name: {
			type: String,
			required: [true, 'Last name is required'],
		},
		country: {
			type: String,
			required: [true, 'Country is required'],
		},
		gender: { type: String },
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		confirm_password: { type: String },
		password_reset_token: { type: String },
		password_reset_timestamp: { type: Date },
		password_mode: { type: String },
		lastlogin: { type: Date },
		dob: { type: Date },
		email: {
			type: String,
			required: [true, 'Email is required'],
		},
		mobile: { type: String },
		email_verified: { type: Boolean, default: false },
		mobile_verified: { type: Boolean, default: false },
		email_verification_token: { type: String },
		mobile_verification_token: { type: String },
		citizen: { type: [CountrySchema] }, // Embeds an array of CountrySchema documents
	},
	{ timestamps: { createdAt: 'joined' } } // Adds createdAt timestamp to track creation date
)

// Index for efficient lookup by coffer_id
ConsumerSchema.index({ coffer_id: 1 })

ConsumerSchema.statics.findByCofferId = async function (consumerId) {
	const con = await this.findOne({ coffer_id: consumerId })
	return con
}

/**
 * Method to find the consumer by cofferId.
 * @param {string} consumerId - to find consumer
 * @returns {object} - consumer object
 */
ConsumerSchema.statics.findByCofferId = async function (consumerId) {
	const con = await this.findOne({ coffer_id: consumerId })
	return con
}
/**
 * Method to compare provided password with stored hashed password.
 * Uses bcrypt to securely compare passwords.
 * @param {string} password - Plain text password to compare
 * @returns {boolean} - True if passwords match, false otherwise
 */
ConsumerSchema.methods.isPasswordMatch = async function (password) {
	return await bcrypt.compare(password, this.password)
}

/**
 * Method to check if the consumer has citizenship records.
 * Iterates through the citizen array and returns the first available citizenship index.
 * @returns {string|null} - First available citizenship index or null if all slots are occupied
 */
ConsumerSchema.methods.hasCitizenship = function () {
	const citizenships = [
		'citizen_primary',
		'citizen_second',
		'citizen_third',
		'citizen_fourth',
	]

	for (const citizen of this.citizen) {
		const index = citizenships.indexOf(citizen.index)
		if (index !== -1) {
			citizenships.splice(index, 1)
		}
	}

	if (citizenships.length) return citizenships[0]
}

ConsumerSchema.methods.fullName = function () {
	return `${this.first_name} ${this.last_name}`
}

ConsumerSchema.methods.customUid = function () {
	let customUid = null
	const email = this.email.trim()

	if (email) {
		customUid = email.replace(/\./g, '').replace('@', '')
	} else {
		const mobile = this.mobile.trim()
		if (mobile) {
			customUid = mobile
		}
	}

	return customUid
}

ConsumerSchema.methods.getProfilepicViewUrl = function () {
	const url = ''
	return url
}

/**
 * Middleware function executed before saving a consumer document.
 * Hashes the password using bcrypt before saving it to the database.
 * @param {Function} next - Callback function to continue the middleware chain
 */
ConsumerSchema.pre('save', async function (next) {
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

module.exports = mongoose.model('Consumer', ConsumerSchema)
