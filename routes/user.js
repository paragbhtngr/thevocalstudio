/**
 * Contains all the User Account Control related functionality.
 */

// Handling imports and requirements for file
import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import session from 'express-session'
import uuid from 'uuid/v4'
import passport from 'passport'
import { doesNotReject } from 'assert';

const router = express.Router()
const LocalStrategy = require('passport-local').Strategy
var connection = require('../connection')
var config = require('../config.json')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(config.db.session);

router.use(passport.initialize());
router.use(passport.session());
// End of requirements

passport.use(new LocalStrategy(
    { usernameField: 'emailAddress' },
    (email, password, done) => {
        console.log('Inside local strategy callback')
        const queryString = `SELECT * FROM users WHERE email_address = '${email}'`
        connection.query(queryString, (error, results, fields) => {
            // Check if user with email address already exists
            if (error) { throw error }
            console.log('Users in DB: ', results)
        
            if(results.length > 0) { // exists
                console.log('USER EXISTS')
                let user = results[0]
                if(comparePassword(password, user.password)) {
                    // User Authenticated. Proceed with Login
                    console.log('user found')
                    return done(null, user)
                } else {
                    res.send({
                        "code":400,
                        "failed":"incorrect_password",
                        "message":"Please enter the correct password"
                    })
                    return
                }
            } else { // User not found
                console.log('INVALID EMAIL ADDRESS')
                res.send({
                    "code":400,
                    "failed":"invalid_email",
                    "message":"Could not find user with this email address"
                })
                return
            }
        })
    }
))

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`)
    const user = users[0].id === id ? users[0] : false; 
    done(null, user);
});
  
router.use(session({
    genid: (req) => {
        console.log('Inside the session middleware')
        console.log(req.sessionID)
        return uuid() // use UUIDs for session IDs
    },
    key: config.session.name,
    secret: config.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

router.get('/', (req, res) => {
    console.group('User.JS init')
    console.log("user router correctly configured")
    console.log(req.sessionID)
    const queryString = 'SELECT * FROM users'
    connection.query(queryString, (error, results, fields) => {
        if (error) {
            throw error;
        }
        console.log('Users in DB: ', results);
    });
    console.groupEnd()
    res.end()
})

// TODO: Optimise new user to make 1 query instead of 2
router.post('/createnewuser', (req, res) => { // Received create user request
    let user = req.body
    user.password = encryptPassword(user.password)
    console.log(user);
    const queryString = `SELECT * FROM users WHERE email_address = '${user.emailAddress}'`
    connection.query(queryString, (error, results, fields) => {
        // Check if user with email address already exists
        if (error) { throw error }
        console.log('Users in DB: ', results)
        
        if(results.length > 0) { // exists
            console.log('USER EXISTS')
            res.send({
                "code":400,
                "failed":"user_exists",
                "message":"User already exists in database"
            })
            return
        } else { // Create new user
            console.log("CREATING NEW USER")
            const queryString = `INSERT INTO users (\`first_name\`, \`last_name\`, \`email_address\`, \`password\`, \`is_admin\`) VALUES (
            '${user.firstName}',
            '${user.lastName}', 
            '${user.emailAddress}',
            '${user.password}', 
            '${0}');
            `
            connection.query(queryString, (error, results, fields) => {
                if (error) { throw error }
            })
            res.send({
                "code":200,
                "succeeded":"user_created",
                "message":"User successfully registered in database"
            })
            return
        }
    })
})

// TODO: Login
router.post('/login', (req, res, next) => {
    console.log('Inside POST /login callback')
    passport.authenticate('local', (err, user, info) => {
        console.log('Inside passport.authenticate() callback');
        console.log(user)
        console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
        console.log(`req.user: ${JSON.stringify(req.user)}`)
        req.login(user, (err) => {
            console.log('Inside req.login() callback')
            console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
            console.log(`req.user: ${JSON.stringify(req.user)}`)
            return res.send('You were authenticated & logged in!\n');
        })
    })(req, res, next);
})

router.get('/authrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
        res.send('you hit the authentication endpoint\n')
    } else {
        res.redirect('/')
    }
})
  
// TODO: Send Password Reset Request
router.post('/pwreset', (req, res) => {
    res.end()
})  

// TODO: Change Password
router.post('/changepw', (req, res) => {
    res.end()
})  

// TODO: Delete User
router.post('/deleteuser', (req, res) => {
    // Received delete user request
    let user = req.body
    console.log(user);
    // Check if user with email address already exists
    const queryString = `SELECT * FROM users WHERE email_address = '${user.emailAddress}'`
    connection.query(queryString, (error, results, fields) => {
        if (error) {
            throw error
        }
        console.log('Users in DB: ', results)
        // If user already exists
        if(results.length === 0) {
            console.log(`USER DOESN'T EXIST`)
            // Return Error Message: User Exists
            res.send({
                "code":400,
                "failed":"user_not_found",
                "message":"User does not exist in database"
            })
            return
        } else {
            //Create new user
            console.log("DELETING USER")
            const queryString = `DELETE FROM users WHERE email_address = '${user.emailAddress}'`
            connection.query(queryString, (error, results, fields) => {
                if (error) {
                    throw error
                }
            })
            res.send({
                "code":200,
                "succeeded":"user_deleted",
                "message":"User successfully deleted from database"
            })
            return
        }
    })
})


// Helper functions
let encryptPassword = (password) => {
    return bcrypt.hashSync(password)
}

let comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)  
}

module.exports = router