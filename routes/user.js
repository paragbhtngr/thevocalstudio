/**
 * Contains all the User Account Control related functionality.
 */

 import express from 'express'

 const router = express.Router()

 router.get('/user', (req, res) => {
    console.log("router correctly configured")
    res.end()
 })

 module.exports = router