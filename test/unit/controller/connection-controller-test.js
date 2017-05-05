var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var controller = rewire('../../../controller/connection-controller');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = chai.assert;

var mockConnectionModel = {};

describe('Getting a connection', function () {

    function getReq() {
        return {
            params: {id: 1}
        }
    }

    function getRes() {
        return {json: sinon.spy()}
    }

    before(function(){
        controller.__set__({
            'connection': mockConnectionModel
        });
    });

    it('should fail because connection read failed', function () {
        var req = getReq();
        var res = getRes();
        var expected = {message: 'Failed to load Connection'};
        mockConnectionModel.get = sinon.stub();
        mockConnectionModel.get.callsArgWith(1, {}, null);

        controller.getConnection(req, res);

        assert(res.json.calledWith(expected));
    });

    it('should pass and return json result', function () {
        var req = getReq();
        var res = getRes();
        var expected = {results: []};
        mockConnectionModel.get = sinon.stub();
        mockConnectionModel.get.callsArgWith(1, null, expected);

        controller.getConnection(req, res);

        assert(res.json.calledWith(expected));
    });
});