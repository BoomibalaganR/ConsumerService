const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const { Consumer } = require('../src/models') 
const httpStatus = require('http-status')


beforeAll(async () => { 
    await mongoose.connection.close()
    await mongoose.connect('mongodb://localhost:27017/test_db')
    
    country1 ={
      "index": "citizen_primary",
      "country": "india",
      "affiliation_type": "dcitz",
      "alt_phone": "",
      "home_address": "brazil home address",
      "mobile_phone": "9488840673",
      "work_address": "",
      "work_phone": ""
    }  
    consumer1 = {
        "coffer_id": "939d55f9ef8908ba",
        "first_name": "Boomi",
        "last_name": "\"R\"",
        "country": "bazil",
        "password": "#Boomi1234",
        "email": "boomibalagan001@gmail.com",
        "citizen": [country1]
    }
    await Consumer.create(consumer1)  

})

afterAll(async () => {
    // await Consumer.deleteMany({}) 
    await mongoose.connection.db.dropDatabase()
    await mongoose.disconnect()
    
})




describe('Citizenship Routes', () => {
    
    test('GET /citizenship/:country/affiliations should return affiliations for a country', async () => {
        const res = await request(app).get('/consumers/citizenship/India/affiliations') 
        
        expect(res.statusCode).toBe(httpStatus.OK)
        expect(res.body).toBeInstanceOf(Array)
    })

    test('POST /citizenship should add a citizenship to a consumer', async () => {
        const payload ={
            "country": "india",
            "affiliation_type": "dcitz",
            "alt_phone": "",
            "home_address": "brazil home address",
            "mobile_phone": "9488840673",
            "work_address": "",
            "work_phone": ""
        } 

        const res = await request(app)
                    .post('/consumers/citizenship')
                    .send(payload)  
        let last_index = res.body.citizen.length - 1
        
        expect(res.statusCode).toBe(httpStatus.OK)
        expect(res.body.citizen).toBeInstanceOf(Array)
        expect(res.body.citizen[last_index]).toMatchObject(payload)
    })

    test('PUT /citizenship/:cat should update an existing citizenship', async () => {      
        const payload ={
            "country": "india",
            "affiliation_type": "dcitz",
            "alt_phone": "",
            "home_address": "brazil home address",
            "mobile_phone": "9488840673",
            "work_address": "",
            "work_phone": ""
        } 

        const res = await request(app)
                    .put('/consumers/citizenship/citizen_primary')
                    .send(payload) 

        let last_index = res.body.citizen.length - 1
        expect(res.statusCode).toBe(httpStatus.OK) 
        expect(res.body.citizen[last_index]).toMatchObject(payload)
    })

    test('DELETE /citizenship/:cat should delete an primary citizenship', async () => {       
        const res = await request(app)
                    .delete('/consumers/citizenship/citizen_primary')
        expect(res.statusCode).toBe(httpStatus.BAD_REQUEST)
    })
})
