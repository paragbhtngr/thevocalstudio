import mysql from 'mysql'

const config = require("./config.json")

var pool = mysql.createPool({
    connectionLimit: 10,
    host: config.db.development.host,
    user: config.db.development.user,
    password: config.db.development.password,
    database: config.db.development.database
});

var getConnection = () => {
    return pool
}

const connection = getConnection()

// connection.query('SELECT * FROM users', function (error, results, fields) {
//     if (error) {
//         throw error;
//     }
//     console.log('The solution is: ', results);
// });

module.exports = connection