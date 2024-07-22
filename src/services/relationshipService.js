const httpStatus = require('http-status')
const { SpecialRelationship, Consumer } = require('../models')
const ApiError = require('../utils/ApiError')

exports.getAllRelationship = async (coffer_id) => {
	const consumer = await Consumer.findByCofferId(coffer_id)

	if (!consumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const relationships = await SpecialRelationship.find({
		$or: [{ acceptor_uid: coffer_id }, { requestor_uid: coffer_id }],
	})

	const items = []

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

		items.push({
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
			profileUrl,
		})
	}
	return items
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
				acceptor_uid: acceptorCofferId,
			},
			{
				requestor_uid: acceptorCofferId,
				acceptor_uid: requestorCofferId,
			},
		],
	})
	if (relationshipExists) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Relationship Already Exit')
	}

	const newRelationship = await SpecialRelationship.create({
		acceptor_uid: acceptorCofferId,
		requestor_uid: requestorCofferId,
		description: description,
	})

	console.log('>>>>>> SEND EMAIL NOTIFICATION <<<<<<')

	return { message: 'Request sent successfully.', data: newRelationship }
}

exports.acceptRelationship = async (acceptorCofferId, relationshipId) => {
	const acceptorConsumer = await Consumer.findByCofferId(acceptorCofferId)

	if (!acceptorConsumer) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Consumer not found')
	}

	const spRelationship = await SpecialRelationship.findById(relationshipId)
	if (!spRelationship) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Relationship not found.')
	}

	const requestorCofferId = spRelationship.requestor_uid

	if (acceptorCofferId === requestorCofferId) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Operation not permitted.')
	}
}
