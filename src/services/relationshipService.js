const httpStatus = require('http-status')
const { SpecialRelationship, Consumer } = require('../models')

const ApiError = require('../utils/ApiError')
const logger = require('../../config/logger')

exports.getAllConsumer = async coffer_id => {
	const consumer = await Consumer.findByCofferId(coffer_id)

	if (!consumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}
	let consumers = await Consumer.find({ coffer_id: { $ne: coffer_id } })
	consumers = consumers.map(data => {
		return {
			firstName: data.first_name,
			lastName: data.last_name,
			email: data.email,
			id: data._id
		}
	})
	return { consumers: consumers }
}

exports.getRelationshipById = async (coffer_id, rel_id) => {
	const consumer = await Consumer.findByCofferId(coffer_id)

	if (!consumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const relationship = await SpecialRelationship.findOne({
		_id: rel_id,
		$or: [{ acceptor_uid: coffer_id }, { requestor_uid: coffer_id }]
	})

	if (!relationship) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Relationship not found')
	}

	return relationship
}

exports.getAllRelationship = async coffer_id => {
	const consumer = await Consumer.findByCofferId(coffer_id)

	if (!consumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const relationships = await SpecialRelationship.find({
		$or: [{ acceptor_uid: coffer_id }, { requestor_uid: coffer_id }]
	})

	const consumerRelationships = []

	for (const srel of relationships) {
		let businessName = ''
		let bizType = ''
		let canAccept = false
		let guid = ''
		let profileUrl = ''
		let tags = []

		if (srel.acceptor_uid === coffer_id) {
			const requestorCofferId = srel.requestor_uid
			tags = srel.acceptor_tags

			if (srel.requestor_type === 'consumer') {
				const con = await Consumer.findByCofferId(requestorCofferId)
				businessName = con.fullName()
				bizType = 'consumer'
				guid = con.customUid()
				profileUrl = con.getProfilepicViewUrl()
			}

			if (!srel.isaccepted) {
				canAccept = true
			}
		} else if (srel.requestor_uid === coffer_id) {
			const acceptorCofferId = srel.acceptor_uid
			tags = srel.requestor_tags

			if (srel.acceptor_type === 'consumer') {
				const con = await Consumer.findByCofferId(acceptorCofferId)
				businessName = con.fullName()
				bizType = 'consumer'
				guid = con.customUid()
				profileUrl = con.getProfilepicViewUrl()
			}
		}

		consumerRelationships.push({
			id: String(srel._id),
			isSpecial: true,
			canAccept,
			business_name: businessName,
			business_category: '',
			products: [],
			description: '',
			isaccepted: srel.isaccepted,
			isarchived: false,
			status: srel.status,
			documents: {},
			profile: {},
			biztype: bizType,
			email: '',
			mobile: '',
			guid,
			tags,
			profileUrl
		})
	}
	return { relationships: consumerRelationships }
}

exports.requestRelationship = async (requestorCofferId, payload) => {
	const { consumerId, description } = payload

	const requestorConsumer = await Consumer.findByCofferId(requestorCofferId)
	// console.log(requestorConsumer)
	if (!requestorConsumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const acceptorConsumer = await Consumer.findById(consumerId)
	if (!acceptorConsumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Acceptor Account not found')
	}

	const acceptorCofferId = acceptorConsumer.coffer_id
	if (requestorCofferId === acceptorCofferId) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Operation not permitted.')
	}

	const relationshipExists = await SpecialRelationship.exists({
		$or: [
			{
				requestor_uid: requestorCofferId,
				acceptor_uid: acceptorCofferId
			},
			{
				requestor_uid: acceptorCofferId,
				acceptor_uid: requestorCofferId
			}
		]
	})
	if (relationshipExists) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Relationship Already Exit')
	}

	const newRelationship = await SpecialRelationship.create({
		acceptor_uid: acceptorCofferId,
		requestor_uid: requestorCofferId,
		description: description
	})

	logger.info('>>>>>> SEND EMAIL NOTIFICATION <<<<<<')

	logger.info('Successfully sent request')
	// return { message: 'Request sent successfully.', data: newRelationship }

	return { message: 'Request sent successfully.' }
}

exports.acceptRelationship = async (acceptorCofferId, relationshipId) => {
	// consumer exists
	const acceptorConsumer = await Consumer.findByCofferId(acceptorCofferId)
	if (!acceptorConsumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Account not found.')
	}

	// First, find the relationship to check its status and validate the acceptor ID
	const relationship = await SpecialRelationship.findOne({
		_id: relationshipId
	})

	if (!relationship) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Relationship not found')
	}
	if (relationship.requestor_uid === acceptorCofferId) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'You cannot accept your own relationship request.'
		)
	}

	if (relationship.isaccepted) {
		throw new ApiError(
			httpStatus.BAD_REQUEST,
			'Relationship is already accepted.'
		)
	}
	//change the properties
	relationship.isaccepted = true
	relationship.accepted_date = Date.now()
	relationship.status = 'accepted'

	// Save the updated relationship
	const acceptedRelationship = await relationship.save()

	// update was successful
	if (!acceptedRelationship) {
		throw new ApiError(
			httpStatus.INTERNAL_SERVER_ERROR,
			'Failed to accept the relationship.'
		)
	}

	return {
		message: 'Relationship successfully accepted'
	}
}

// exports.rejectRelationship = async (
// 	rejectorCofferId,
// 	relationshipId,
// 	rejectReason
// ) => {
// 	// consumer exists
// 	const rejectorConsumer = await Consumer.findByCofferId(rejectorCofferId)
// 	if (!rejectorConsumer) {
// 		throw new ApiError(httpStatus.NOT_FOUND, 'Account not found.')
// 	}

// // Find and update the relationship
// const rejectedRelationship = await SpecialRelationship.findOneAndUpdate(
// 	{
// 		_id: relationshipId,
// 		acceptor_uid: rejectorCofferId,
// 		isaccepted: false
// 	},
// 	{
// 		$set: {
// 			status: 'rejected',
// 			reject_reason: rejectReason
// 		}
// 	},
// 	{ new: true } // Return the updated document
// )

// if (!rejectedRelationship) {
// 	throw new ApiError(
// 		httpStatus.NOT_FOUND,
// 		'Relationship not found or already rejected.'
// 	)
// }

// return {
// 	message: 'Successfully rejected relationship.'
// }
// }
