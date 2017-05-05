/**
 * Tests relating to server setup
 */

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var extractor = rewire('../../../helper/extractor');

var describe = mocha.describe;
var should = chai.should();
var it = mocha.it;

describe('Auth middleware tests', function () {

    describe('parseJSONResponse()', function () {

        // Use Rewire to access private method
        var parseJSONResponse = extractor.__get__('parseJSONResponse');

        it('should return an valid object if content type correct', function () {
            var res = {body: '{"someKey": 1}', headers: {'content-type': 'application/json'}};

            return parseJSONResponse(res)
                .then(resOjb => {
                    chai.expect(resOjb).to.be.an('object');
                    chai.expect(resOjb).to.have.property('someKey');
                    chai.expect(resOjb.someKey).to.equal(1);
                });
        });

        it('should fail if content type is not JSON', function () {
            var res = {body: '', headers: {'content-type': 'text/html'}};

            return parseJSONResponse(res)
                .then(resOjb => {
                }).catch(err => {
                    chai.expect(err).to.be.an('Error');
                })
        });
    });

    describe('obtainToken()', function () {

        var getRequest = extractor.__get__('getRequest');
        var obtainToken = extractor.__get__('obtainToken');

        it('should return an error if making a request fails', function (done) {
            var req = getRequest('http://google.ie', 'GET');
            var stubbedGetRequest = sinon.stub();

            stubbedGetRequest.returns(req);
            extractor.__set__('getRequest', stubbedGetRequest);

            obtainToken(function (err) {
                console.log(err);
            });

            done();
        });
    });
});

