var env = process.env.NODE_ENV || "development"
var config = require("../knexfile.js")[env];
console.log(config);
module.exports = require("knex")(config);