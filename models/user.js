const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require passport-local-mongoose package - https://github.com/saintedlama/passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true, // email must me unique
    },
    isAdmin: {
        type: Number,
        default: 2, //default is 2 (regular user)
        enum: [0,1,2],
        required: true,
    }
    // Note: do not specify username or password here as we 'plugin' the passp-ort-localmongoose to the UserSchema below
});
// this plugin adds username and passowrd fields and makes sure usernames are not duplicated, it also gives us additional methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

