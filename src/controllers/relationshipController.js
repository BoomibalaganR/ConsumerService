const httpStatus = require('http-status')

const { relationshipService } = require('../services')
const catchAsync = require('../utils/catchAsync')

exports.getAllConsumer = catchAsync(async (req, res, next) => {
	const { coffer_id } = req.user
	const data = await relationshipService.getAllConsumer(coffer_id)
	res.status(httpStatus.OK).json(data)
})

exports.getAllRelationship = catchAsync(async (req, res, next) => {
	const { coffer_id } = req.user
	const data = await relationshipService.getAllRelationship(coffer_id)
	res.status(httpStatus.OK).json(data)
})

exports.requestRelationship = catchAsync(async (req, res, next) => {
	const { coffer_id } = req.user
	const payload = req.body
	const data = await relationshipService.requestRelationship(
		coffer_id,
		payload
	)
	res.status(httpStatus.OK).json(data)
})

exports.acceptRelationship = catchAsync(async (req, res, next) => {
	const { coffer_id } = req.user
	const { rel_id } = req.params
	const data = await relationshipService.acceptRelationship(coffer_id, rel_id)
	res.status(httpStatus.OK).json(data)
})

exports.rejectRelationship = catchAsync(async (req, res, next) => {
	const { coffer_id } = req.user
	const { rel_id } = req.params
	const rejectedReason = req.body.rejectedReason || ''

	const data = await relationshipService.rejectRelationship(
		coffer_id,
		rel_id,
		rejectedReason
	)
	res.status(httpStatus.OK).json(data)
})
