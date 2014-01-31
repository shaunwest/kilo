/**
 * User: shaun
 * Date: 1/5/14 3:58 PM
 */

var dbUrl = "mongodb://localhost/retro2d",
    mongoose = require('mongoose'),
    db;

mongoose.connect(dbUrl);

db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    var userSchema = mongoose.Schema({
        name: String,
        username: String,
        lastname: String
    });

    var User = mongoose.model('User', userSchema);
    /*var bob = new User({name: 'Bob', username: 'bob1', lastname: 'Johnson'});
    console.log(bob.name);

    bob.save(function(err, bob) {
        if(err) {
            console.log("save error");
        }
    })*/
});

module.exports = db;
