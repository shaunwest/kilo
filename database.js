/**
 * User: shaun
 * Date: 1/5/14 3:58 PM
 */

var dbUrl = "express1";
var collections = ["users"];

var db = require("mongojs").connect(dbUrl, collections);

module.exports = db;
