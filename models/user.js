const mongoose = require('mongoose');
const passportMongoose = require('passport-local-mongoose');
const passport = require('passport');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportMongoose);

module.exports = mongoose.model('User', UserSchema);