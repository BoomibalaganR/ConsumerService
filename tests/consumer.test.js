const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const { Consumer } = require('../src/models')
const httpStatus = require('http-status')

describe('Citizenship Routes', () => {
	beforeAll(async () => {
		await mongoose.connection.close()
		await mongoose.connect(
			'mongodb+srv://boomibalaganR:Boomi1234@cluster0.ue0af0l.mongodb.net/test-db?retryWrites=true&w=majority&appName=Cluster0'
		)

		country1 = {
			index: 'citizen_primary',
			country: 'india',
			affiliation_type: 'dcitz',
			alt_phone: '',
			home_address: 'brazil home address',
			mobile_phone: '9488840673',
			work_address: '',
			work_phone: '',
		}
		consumer1 = {
			coffer_id: 'f5141f9ac440cd5e',
			first_name: 'Boomibalagan',
			last_name: '"R"',
			country: 'bazil',
			password: '#Boomi1234',
			email: 'boomibalagan001@gmail.com',
			citizen: [country1],
		}
		await Consumer.create(consumer1)
	})

	afterAll(async () => {
		const collections = await mongoose.connection.db.collections()

		for (let collection of collections) {
			await collection.drop()
		}

		await mongoose.disconnect()
	})

	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2ZmZXJfaWQiOiJmNTE0MWY5YWM0NDBjZDVlIiwicGsiOiI2NjZjMjAzYzdjMGZmMjM3Y2QyNzZhOWMiLCJpYXQiOjE3MjEzNzEwNzcsImV4cCI6MTcyMTQ1NzQ3N30.pL8y2LLBh7nDulxQreCETpiu6_mUnrWqLhyKeDGOhv0'
	test('POST /citizenship should add a citizenship to a consumer', async () => {
		const payload = {
			country: 'india',
			affiliation_type: 'dcitz',
			alt_phone: '',
			home_address: 'brazil home address',
			mobile_phone: '9488840673',
			work_address: '',
			work_phone: '',
		}

		const res = await request(app)
			.post('/api/v1/consumers/citizenship')
			.set('Authorization', `Bearer ${token}`)
			.send(payload)
		// let last_index = res._body.citizen.length - 1

		expect(res.statusCode).toBe(httpStatus.OK)
		expect(res._body.citizen).toBeInstanceOf(Array)
		// expect(res._body.citizen[last_index]).toMatchObject(payload)
	})

	test('GET /citizenship/:country/affiliations should return affiliations for a country', async () => {
		// Replace with your actual token

		const res = await request(app)
			.get('/api/v1/consumers/citizenship/India/affiliations')
			.set('Authorization', `Bearer ${token}`)

		expect(res.statusCode).toBe(httpStatus.OK)
		expect(res.body).toBeInstanceOf(Array)
	})

	test('PUT /citizenship/:cat should update an existing citizenship', async () => {
		// const token =
		// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2ZmZXJfaWQiOiJmNTE0MWY5YWM0NDBjZDVlIiwicGsiOiI2NjZjMjAzYzdjMGZmMjM3Y2QyNzZhOWMiLCJpYXQiOjE3MjA2ODAyNjUsImV4cCI6MTcyMDc2NjY2NX0.tFFp2hQfL00TPpbneo3qj9kNYWpFeoEcrz5c42dRDbs'

		const payload = {
			country: 'india',
			affiliation_type: 'dcitz',
			alt_phone: '',
			home_address: 'brazil home address',
			mobile_phone: '9488840673',
			work_address: '',
			work_phone: '',
		}

		const res = await request(app)
			.put('/api/v1/consumers/citizenship/citizen_primary')
			.set('Authorization', `Bearer ${token}`)
			.send(payload)
		expect(res.statusCode).toBe(httpStatus.OK)

		// If res.body.citizen is expected to be an array, you can check it exists and has a length
		expect(Array.isArray(res._body.citizen)).toBe(true)
		expect(res._body.citizen.length).toBeGreaterThan(0)

		let last_index = res._body.citizen.length - 1
		expect(res._body.citizen[last_index]).toMatchObject(payload)
	})

	test('DELETE /citizenship/:cat should delete an primary citizenship', async () => {
		// const token =
		// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2ZmZXJfaWQiOiJmNTE0MWY5YWM0NDBjZDVlIiwicGsiOiI2NjZjMjAzYzdjMGZmMjM3Y2QyNzZhOWMiLCJpYXQiOjE3MjA2ODAyNjUsImV4cCI6MTcyMDc2NjY2NX0.tFFp2hQfL00TPpbneo3qj9kNYWpFeoEcrz5c42dRDbs'

		const res = await request(app)
			.delete('/api/v1/consumers/citizenship/citizen_primary')
			.set('Authorization', `Bearer ${token}`)
		expect(res.statusCode).toBe(httpStatus.BAD_REQUEST)
	})
})
