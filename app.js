import express from 'express'
import morgan from 'morgan'

const config = require("./config.json")

const app = express()
const userRouter = require('./routes/user')

app.use(morgan('short'))

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.use('/user', userRouter)

app.listen(3003, () => {
    console.log(`The Vocal Studio Server is up and running on port ${config.app.port}!`)
})  