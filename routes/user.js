/**
 * Contains all the User Account Control related functionality.
 */

import express from 'express'
import bcrypt from 'bcrypt'

const saltRounds = 10
const router = express.Router()
var connection = require('../connection')

router.get('/', (req, res) => {
    console.group('User.JS init')
    console.log("user router correctly configured")
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

// TODO: Create New User
router.post('/createnewuser', (req, res) => {
    let userExists = false
    // Check if user with email address already exists
    const queryString = 'SELECT * FROM users WHERE email_address = ?'
    connection.query(queryString, [email], (error, results, fields) => {
        if (error) {
            throw error;
        }

        console.log('Users in DB: ', results);
        // If user already exists
        userExists = true
        // Return Error Message: User Exists
    });

    if(!userExists) {
        //Create new user
    }
    res.end()
})

// TODO: Login
router.post('/login', (req, res) => {
    res.end()
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
    res.end()
})  


// Helper functions
let encryptPassword = (password) => {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        return hash
    })
}

let comparePassword = (password, hash) => {
    bcrypt.compare(password, hash, function(err, res) {
        return res
    })
}

module.exports = router