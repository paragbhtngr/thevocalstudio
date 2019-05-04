const config = require("./config.json")

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : config.db.development.host,
      user : config.db.development.user,
      password : config.db.development.password,
      database : config.db.development.database
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host : config.db.development.host,
      user : config.db.development.user,
      password : config.db.development.password,
      database : config.db.development.database
    },
    pool: {
      min: 0,
      max: 10
    }, 
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    }
  }
}