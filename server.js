const express = require('express')
const userRouter = require('./routes/userRouter')

require('dotenv').config()

const mongoose = require('mongoose')
const server = express()

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log('Database connected :D')
    })
    .catch((e)=>{
        console.log(e.message)
    })

server.use(express.json())

server.use('/', userRouter)
server.listen(process.env.PORT,(() => {
    console.log(`Server up and running on port, ${process.env.PORT}`)
}))