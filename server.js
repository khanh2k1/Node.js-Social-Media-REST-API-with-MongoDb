const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const { throws } = require('assert')
const exp = require('constants')
const app = express()

// routes
const userRoute = require('./routes/users.routes')
const authRoute = require('./routes/auth.routes')
const postRoute = require('./routes/posts.routes')
// config 
dotenv.config()

// mongoose 
mongoose.connect(process.env.MONGO_URL, (err)=> {
    try{
        console.log("Ket noi thanh cong mongoDB !")
    }catch(err) {
        console.log(err)
    }
});


// middleware 
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.get('/',(req, res)=> {
    res.send('Welcome to Homepage')
})

const PORT = 8800


app.listen(PORT, {useNewUrlParser: true, useUnifiedTopology: true}, ()=> {
    console.log(`Backend server is running ${PORT}`)
})