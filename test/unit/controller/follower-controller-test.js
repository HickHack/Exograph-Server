var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var controller = rewire('../../../controller/follower-controller');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = chai.assert;

var mockFollowerModel = {};

describe('Getting a follower', function () {

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
            'follower': mockFollowerModel
        });
    });

    it('should fail because follower read failed', function () {
        var req = getReq();
        var res = getRes();
        var expected = {message: 'Failed to load Follower'};
        mockFollowerModel.get = sinon.stub();
        mockFollowerModel.get.callsArgWith(1, {}, null);

        controller.getFollower(req, res);

        assert(res.json.calledWith(expected));
    });

    it('should pass and return json result', function () {
        var req = getReq();
        var res = getRes();
        var expected = {results: []};
        mockFollowerModel.get = sinon.stub();
        mockFollowerModel.get.callsArgWith(1, null, expected);

        controller.getFollower(req, res);

        assert(res.json.calledWith(expected));
    });
});