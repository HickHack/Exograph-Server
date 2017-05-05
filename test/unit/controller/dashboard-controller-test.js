var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var config = require('../../../config');
var rewire = require('rewire');
var controller = rewire('../../../controller/dashboard-controller');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = sinon.assert;

var mockJobModel = {};
process.conf = config;

describe('Test getting the root page', function () {

    function getReq() {
        return {
            user: {
                id: 1,
                getNetworks: sinon.stub()
            }
        }
    }

    function getRes() {
        return {
            render: sinon.spy(),
            status: sinon.stub(),
            send: sinon.spy()
        }
    }

    before(function(){
        controller.__set__({
            'jobs': mockJobModel
        });
    });

    it('should return status 500 for getNetworks', function (done) {
        var req = getReq();
        var res = getRes();

        req.user.getNetworks.callsArgWith(0, {}, null);
        res.status.withArgs(sinon.match(500)).returns(res);
        controller.getRoot(req, res);

        assert.calledWith(res.status, 500);
        assert.calledOnce(res.send);

        done();
    });

    it('should return status 404 if getSummaryForUser fails', function (done) {
        var req = getReq();
        var res = getRes();
        mockJobModel.getSummaryForUser = sinon.stub();

        req.user.getNetworks.callsArgWith(0, null, {});
        res.status.withArgs(sinon.match(404)).returns(res);
        mockJobModel.getSummaryForUser.callsArgWith(1, {}, null);

        controller.getRoot(req, res);

        assert.calledWith(res.status, 404);
        assert.calledOnce(res.send);
        assert.notCalled(res.render);

        done();
    });

    it('should render the dashboard page', function (done) {
        var req = getReq();
        var res = getRes();

        var expected = {
            title: process.conf.app.NAME,
            pageName: 'Dashboard',
            user: req.user,
            networks: [0, 1, 2],
            summary:  [1, 2, 6]
        };

        mockJobModel.getSummaryForUser = sinon.stub();
        req.user.getNetworks.callsArgWith(0, null, expected.networks);
        res.status.withArgs(sinon.match(404)).returns(res);
        mockJobModel.getSummaryForUser.callsArgWith(1, null, expected.summary);

        controller.getRoot(req, res);

        assert.notCalled(res.status);
        assert.notCalled(res.send);
        assert.calledWith(res.render, 'graph/dashboard', expected);

        done();
    })
});