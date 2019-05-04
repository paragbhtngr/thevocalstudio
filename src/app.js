import express from 'express'
import morgan from 'morgan'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const config = require("../config.json")
const db = require('./database/connection')

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

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat', 
    name: 'thevocalstudio',
    cookie: { 
        // expires: Date.now() + parseInt(process.env.COOKIE_EXPIRATION, 10),
        maxAge: parseInt(86400000, 10)
    },
    saveUninitialized: true,
    resave: false,
    rolling: true
}))

//Models
// var models = require("./models");
 
//Sync Database
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log("DB error:" + err))

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.use('/user', require('./routes/user'))
app.use('/audio', require('./routes/audio'))

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
    console.log(`The Vocal Studio Server is up and running on port ${config.app.port}!`)
})  