const app = require('./app') 


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`consumer service is running on ${process.env.PORT}`)
})
