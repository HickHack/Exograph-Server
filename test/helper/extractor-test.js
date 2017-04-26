/**
 * Tests relating to server setup
 */

process.env.NODE_ENV = 'test';

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var extractor = rewire('../../helper/extractor');

var describe = mocha.describe;
var should = chai.should();
var it = mocha.it;

describe('Auth middleware tests', function () {

    describe('parseJSONResponse()', function () {

        // Use Rewire to access private method
        var parseJSONResponse = extractor.__get__('parseJSONResponse');

        it('should return an valid object if content type correct', function (done) {
            var res = {body: '{"someKey": 1}', headers: {'content-type': 'application/json'}};
            var callback = sinon.spy();

            json = parseJSONResponse(res, callback);


            chai.assert(callback.calledWith(null, JSON.parse(res.body)));

            done();
        });

        it('should fail if content type is not JSON', function (done) {
            var res = {body: '', headers: {'content-type': 'text/html'}};
            var callback = sinon.spy();

            json = parseJSONResponse(res, callback);

            chai.assert(!res.body.called);
            chai.assert(callback.calledWith(Error()));

            done();
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

