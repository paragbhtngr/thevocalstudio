import express from 'express'

const app = express()

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.listen(3003, () => {
    console.log('The Vocal Studio Server is up and running on port 3003!')
})