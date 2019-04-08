import express from 'express'
import mysql from 'mysql'
import morgan from 'morgan'

const config = require("./config.json")

const app = express()
const router = require('./routes/user')

app.use(morgan('short'))
app.use(router)

var con = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// con.query('SELECT * FROM users', function (error, results, fields) {
//     if (error) {
//         throw error;
//     }
//     console.log('The solution is: ', results);
// });
   
// con.end();

app.get("/", (req, res) => {
    console.log("Responding to root route")
    res.send("<h2>The Vocal Studio App</h2>")
})

app.listen(3003, () => {
    console.log(`The Vocal Studio Server is up and running on port ${config.app.port}!`)
})