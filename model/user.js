var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname : String,
    surname : String,
    dob : { type : Date, default : Date.now },
    email : String,
    password : String
});


mongoose.model('user', userSchema);