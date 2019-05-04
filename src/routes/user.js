/**
* Contains all the User Account Control related functionality.
*/

// Handling imports and requirements for file
import express from 'express'
import bcrypt from 'bcrypt-nodejs'
import session from 'express-session'
import uuid from 'uuid/v4'
import passport from 'passport'
import knex from '../../db/knex'
import { resolve } from 'bluebird';

const router = express.Router()
const LocalStrategy = require('passport-local').Strategy
var connection = require('../database/connection')
var config = require('../../config.json')
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(config.db.session);

router.use(passport.initialize());
router.use(passport.session());
// End of requirements

passport.use(new LocalStrategy({ 
      usernameField: 'emailAddress',
      passwordField: 'password'
    },
    (email, password, done) => {
      console.log('Inside local strategy callback')
      userExists('email_address', email)
      .then(([ doesExist, u ]) => {
        if(doesExist) {
          if(comparePassword(password, u.password)) {
            // User Authenticated. Proceed with Login
            console.log('user found')
            return done(null, u)
          } else {
            res.send({
              "code":400,
              "failed":"incorrect_password",
              "message":"Please enter the correct password"
            })
            return
          }
        } else {
          console.log('INVALID EMAIL ADDRESS')
          res.send({
            "code":400,
            "failed":"invalid_email",
            "message":"Could not find user with this email address"
          })
        }
      })
      .catch(err => {console.log(err)})
      // const queryString = `SELECT * FROM users WHERE email_address = '${email}'`
      // connection.query(queryString, (error, results, fields) => {
      //   // Check if user with email address already exists
      //   if (error) { throw error }
      //   console.log('Users in DB: ', results)
        
      //   if(results.length > 0) { // exists
      //     console.log('USER EXISTS')
      //     let user = results[0]
      //     if(comparePassword(password, user.password)) {
      //       // User Authenticated. Proceed with Login
      //       console.log('user found')
      //       return done(null, user)
      //     } else {
      //       res.send({
      //         "code":400,
      //         "failed":"incorrect_password",
      //         "message":"Please enter the correct password"
      //       })
      //       return
      //     }
      //   } else { // User not found
      //     console.log('INVALID EMAIL ADDRESS')
      //     res.send({
      //       "code":400,
      //       "failed":"invalid_email",
      //       "message":"Could not find user with this email address"
      //     })
      //     return
      //   }
      // })
    }
  )
)

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  userExists('id', id)
  .then(([ doesExist, u ]) => {
    return doesExist ? done(null, u) : false
  })
  .catch(err => {console.log(err)})
  // const queryString = `SELECT * FROM users WHERE id = '${id}'`
  // connection.query(queryString, (error, results, fields) => {
  //   // Check if user with email address already exists
  //   if (error) { throw error }
  //   console.log('Users in DB: ', results)
    
  //   if(results.length > 0) { // exists
  //     console.log('USER EXISTS')
  //     let user = results[0]
  //     return done(null, user)
  //   } else { // User not found
  //     return false
  //   }
  // })
});

router.get('/', (req, res) => {
  console.group(`USER: GET '/'`)
  console.log(`SESSION ID: ${req.sessionID}`)
  
  knex.select().from('users').then((users) => { // 'select * from users'
  console.log(users)
  console.groupEnd()
  res.send(users[0])
})
})

router.post('/createnewuser', (req, res) => { // Received create user request
  console.group(`USER: POST '/createnewuser'`)
  console.log(`SESSION ID: ${req.sessionID}`)
  let user = req.body
  user.password = encryptPassword(user.password)
  console.log(user);
  
  userExists('email_address', user.emailAddress)
  .then(([ doesExist, u ]) => {
    if(doesExist) {
      res.send({
        "code":400,
        "failed":"user_exists",
        "message":"User already exists in database"
      })
      return
    } else {
      console.log("Creating new user...")
      knex('users').insert({
        first_name: user.firstName,
        last_name: user.lastName,
        email_address: user.emailAddress,
        password: user.password,
        is_admin: false
      })
      .then(() => {
        console.log(`Created.`)
        knex.select().from('users').then((users) => {
          console.log(`Current users in DB:`)
          console.log(users)
        })
        console.groupEnd()
        res.send({
          "code":200,
          "succeeded":"user_created",
          "message":"User successfully registered in database"
        })
      })
      return
    }
  })
  .catch(err => console.log(err))
})

// TODO: Login
router.post('/login', (req, res, next) => {
  console.group(`USER: POST '/login'`)
  console.log(`SESSION ID: ${req.sessionID}`)
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(user)
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      console.log(`is authenticated: ${req.isAuthenticated()}`)
      console.groupEnd()
      return res.send('You were authenticated & logged in!\n')
    })
  })(req, res, next);
})

// TODO: Logout
router.get('/logout', (req, res, next) => {
  res.end("You have been logged out (not really)")
})

router.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback')
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    // console.log(req)
    res.send("Uh oh. Couldn't authenticate")
  }
})

// TODO: Send Password Reset Request
router.post('/resetpw', (req, res, next) => {
  console.group(`USER: POST '/resetpw'`)
  console.log(`SESSION ID: ${req.sessionID}`)
  // userExists('email_address')
  console.log(`Resetting Password for ${req.body.emailAddress}`)
  
  res.end(`Password Reset request sent to ${req.body.emailAddress}`)
})  

// TODO: Change Password
router.post('/changepw', (req, res) => {
  res.end(`Changed ${req.body.emailAddress}'s password to "${req.body.newPassword}"`)
})  

// TODO: Delete User
router.post('/deleteuser', (req, res) => {
  console.group(`USER: POST '/deleteuser'`)
  console.log(`SESSION ID: ${req.sessionID}`)
  // Received delete user request
  let user = req.body
  // Check if user with email address already exists
  userExists('email_address', user.emailAddress)
  .then(([ doesExist, u ]) => {
    if(doesExist) {
      console.log('Users in DB: ', u)
      console.log("Deleting user...")
      knex('users').where('id', u.id).update({
        is_deleted: true
      }).then(() => {
        res.send({
          "code":200,
          "succeeded":"user_deleted",
          "message":"User successfully deleted from database"
        })
        console.groupEnd()
        return
      })
    } else {
      res.send({
        "code":400,
        "failed":"user_not_found",
        "message":"User does not exist in database"
      })
      console.groupEnd()
      return
    }
  })
  .catch(err => {
    console.log(err)
    console.groupEnd()
  })
})

// Helper functions
let encryptPassword = (password) => {
  return bcrypt.hashSync(password)
}

let comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash)  
}

let userExists = (field, value) => {
  return new Promise((resolve, reject) => {
    knex.select().from('users').where({[field]: value, is_deleted: false}).then((u) => {
      let users = u
      if(users.length > 0) { // exists
        console.log(`USER EXISTS:`)
        console.log(users[0].email_address)
        resolve([true, users[0]])
      } else { // doesn't exist
        resolve([false, null])
      }
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = router