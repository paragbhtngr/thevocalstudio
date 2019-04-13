import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const config = require("./config.json")

const app = express()

app.use(morgan('short'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const userRouter = require('./routes/user')

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.use('/user', userRouter)

app.listen(3003, () => {
    console.log(`The Vocal Studio Server is up and running on port ${config.app.port}!`)
})  