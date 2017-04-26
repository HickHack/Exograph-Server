/**
 * Tests relating to server setup
 */

process.env.NODE_ENV = 'test';

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var auth = require('../../helper/auth');

var describe = mocha.describe;
var it = mocha.it;

describe('Auth middleware tests', function () {

    var res = {redirect: sinon.spy()};

    describe('checkAuth()', function () {
        it('should continue if authenticated', function (done) {
            var req = {isAuthenticated: function() {return true} };
            var callback = sinon.spy();

            auth.checkAuth(req, res, callback);

            chai.assert(callback.called);
            chai.assert(!res.redirect.called);

            done();
        });

        it('should redirect if not authenticated', function (done) {
            var req = {isAuthenticated: function() {return false} };
            var callback = sinon.spy();

            auth.checkAuth(req, res, callback);

            chai.assert(!callback.called);
            chai.assert(res.redirect.called);

            done();
        });
    });

    describe('logout()', function () {

        it('logout if request is authenticated and redirect', function (done) {
            var req = {
                isAuthenticated: function() {return true},
                logout: sinon.spy()
            };

            auth.logout(req, res);

            chai.assert(req.logout.called);
            chai.assert(res.redirect.called);

            done();
        });

        it('dont logout but redirect if not authenticated', function (done) {
            var req = {
                isAuthenticated: function() {return false},
                logout: sinon.spy()
            };

            auth.logout(req, res);

            chai.assert(!req.logout.called);
            chai.assert(res.redirect.called);

            done();
        })
    });
});

