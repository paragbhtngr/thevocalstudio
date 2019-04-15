import express from 'express'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import bodyParser from 'body-parser'

const config = require("./config.json")

const app = express()

app.use(morgan('short'))

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// // For Passport
// app.use(session({ secret: config.passport.secret, resave: true, saveUninitialized:true})) // session secret
// app.use(passport.initialize())
// app.use(passport.session()) // persistent login sessions

// var env = require('dotenv').config()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});

//Models
// var models = require("./models");
 
//Sync Database
// models.sequelize.sync().then(function() {
//     console.log('Nice! Database looks fine')
// }).catch(function(err) {
//     console.log(err, "Something went wrong with the Database Update!")
// });

const userRouter = require('./routes/user')

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.use('/user', userRouter)

app.listen(3003, () => {
    console.log(`The Vocal Studio Server is up and running on port ${config.app.port}!`)
})  