const Sequelize = require("sequelize")
const db = require("../database/connection")

const User = db.define('user', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    type: Sequelize.INTEGER
  },
  first_name: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  last_name: {
    type: Sequelize.STRING,
    notEmpty: true
  },
  email: {
    type: Sequelize.STRING,
    notEmpty: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

// export default function(sequelize, Sequelize) {
//     var User = sequelize.define('user', {
//         id: {
//             autoIncrement: true,
//             primaryKey: true,
//             unique: true,
//             type: Sequelize.INTEGER
//         },
//         first_name: {
//             type: Sequelize.STRING,
//             notEmpty: true
//         },
//         last_name: {
//             type: Sequelize.STRING,
//             notEmpty: true
//         },
//         email: {
//             type: Sequelize.STRING,
//             notEmpty: true,
//             unique: true,
//             validate: {
//                 isEmail: true
//             }
//         },
//         password: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         is_admin: {
//             type: Sequelize.BOOLEAN,
//             allowNull: false,
//             defaultValue: false
//         }
//     });
//     return User;

// }

module.exports = User;