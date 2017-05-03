var LoginPage = require('../pages/login-page');
var mocha = require('mocha');
var chai = require('chai');

var describe = mocha.describe;
var after = mocha.after;
var expect = chai.expect;
var it = mocha.it;

describe("login tests", function () {

    it('should login successfully', function () {
        LoginPage.open(function () {
            LoginPage.setUsername("Graham", function () {
                console.log("Hello");
            });
        });
    });
});

