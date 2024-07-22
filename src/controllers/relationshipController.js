const httpStatus = require('http-status')

const { relationshipService } = require('../services')
const catchAsync = require('../utils/catchAsync')

exports.getAllRelationship = catchAsync(async (res, req, next) => {
	const { coffer_id } = req.user
	const data = await relationshipService.getAllRelationship(coffer_id)
	res.status(httpStatus.OK).json(data)
})

exports.requestRelationship = catchAsync(async (res, req, next) => {
	const { coffer_id } = req.user
	const payload = req.body
	const data = await relationshipService.requestRelationship(
		coffer_id,
		payload
	)
	res.status(httpStatus.OK).json(data)
})

exports.acceptRelationship = catchAsync(async (res, req, next) => {
	const { coffer_id } = req.user
	const payload = req.body
	const data = await relationshipService.requestRelationship(
		coffer_id,
		payload
	)
	res.status(httpStatus.OK).json(data)
})
