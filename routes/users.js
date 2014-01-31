
/*
 * GET users listing.
 */
var db = require("../config/database.js");

exports.all = function(req, res) {
    db.users.find({}, function(err, users) {
        if(err) return;
        res.json(users);
    });
};

