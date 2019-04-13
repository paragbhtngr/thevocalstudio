/**
 * Contains all the User Account Control related functionality.
 */

import express from 'express'
import bcrypt from 'bcrypt-nodejs'

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

// TODO: Optimise new user to make 1 query instead of 2
router.post('/createnewuser', (req, res) => {
    // Received create user request
    let user = req.body
    user.password = encryptPassword(user.password)
    console.log(user);
    // Check if user with email address already exists
    const queryString = `SELECT * FROM users WHERE email_address = '${user.emailAddress}'`
    connection.query(queryString, (error, results, fields) => {
        if (error) {
            throw error
        }
        console.log('Users in DB: ', results)
        // If user already exists
        if(results.length > 0) {
            console.log('USER EXISTS')
            // Return Error Message: User Exists
            res.send({
                "code":400,
                "failed":"user_exists",
                "message":"User already exists in database"
            })
            return
        } else {
            //Create new user
            console.log("CREATING NEW USER")
            const queryString = `INSERT INTO users (\`first_name\`, \`last_name\`, \`email_address\`, \`password\`, \`is_admin\`) VALUES (
            '${user.firstName}',
            '${user.lastName}', 
            '${user.emailAddress}',
            '${user.password}', 
            '${0}');
            `
            connection.query(queryString, (error, results, fields) => {
                if (error) {
                    throw error
                }
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