const Sequelize = require("sequelize")
const config = require("../../config.json")

const db = new Sequelize(
  config.db.development.database, 
  config.db.development.user, 
  config.db.development.password, 
  config.db.development, {
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = db;

// import mysql from 'mysql'


// var pool = mysql.createPool({
//     connectionLimit: 10,
//     host: config.db.development.host,
//     user: config.db.development.user,
//     password: config.db.development.password,
//     database: config.db.development.database
// });

// var getConnection = () => {
//     return pool
// }

// const connection = getConnection()

// // connection.query('SELECT * FROM users', function (error, results, fields) {
// //     if (error) {
// //         throw error;
// //     }
// //     console.log('The solution is: ', results);
// // });

// module.exports = connection