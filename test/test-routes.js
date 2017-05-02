var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('', function () {

    it('should test GET login page', function (done) {
        chai.request(server)
            .get('/login')
            .end(function (err, res) {
                res.body.should.be.a('object');
                res.should.have.status(200);
                res.should.be.html;

                done();
            });
    });
});