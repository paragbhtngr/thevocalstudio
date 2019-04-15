"use strict";
 
import fs from "fs"
import path from "path"
import Sequelize from "sequelize"
var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, '../config.json'));
var sequelize = new Sequelize(
    config.db.development.database, 
    config.db.development.user, 
    config.db.development.password, 
    config.db.development);
var db = {};
 
 
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });
 
Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;