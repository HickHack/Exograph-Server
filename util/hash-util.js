/**
 * Hashing Logic
 */

var sha256 = require('sha256');
var bcrypt = require('bcrypt-nodejs');

var hash = module.exports = {};

hash.generateSha256Key = function(string) {
    return sha256.x2(string);
}

hash.generateBcryptKey = function (password, callback) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null, callback);
}

hash.bcryptCompare = function(password, pass) {
    return bcrypt.compareSync(password, pass);
}