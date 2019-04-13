/**
 * Contains all the Audio data related functionality.
 * Actual static files are not served from this endpoint. For that a separate
 * request needs to be made to the File Server (Node endpoint at the moment, to 
 * be replaced with Nginx and Apache at a later point)
 */

import express from 'express'
import formidable from 'formidable'

const router = express.Router()

router.get('/', (req, res) => {
    console.log("audio router correctly configured")
    res.end()
})

// TODO: Upload audio file
router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();

    form.parse(req);
    form.on('fileBegin', (name, file) => {
        file.path = __dirname + '/../public/' + file.name;
    });

    form.on('file', (name, file) => {
        console.log('Uploaded ' + file.name);
    });

    res.end()
})

// TODO: Delete audio file

// Helper functions


module.exports = router