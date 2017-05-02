/**
 * Created by graham on 02/05/17.
 */

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var config = require('../../config');
var rewire = require('rewire');
var controller = rewire('../../controller/job-controller');

var describe = mocha.describe;
var before = mocha.before;
var it = mocha.it;
var assert = sinon.assert;

var mockJobModel = {};
const error = {message: 'an error'};
const jobs = [1, 2, 3, 4];

process.conf = config;

describe('Test get job alert data', function () {

    before(function () {
        controller.__set__({
            'job': mockJobModel
        });
    });

    it('should return json error if getJobsForUser() fails ', function (done) {
        var req = getReq();
        var res = getRes();

        mockJobModel.getJobsForUser = sinon.stub();
        mockJobModel.getJobsForUser.callsArgWith(2, error, null);
        controller.getJobsAlert(req, res);

        assert.calledOnce(res.json);
        assert.calledWith(res.json, getMockJsonResponse([], error.message));

        done();
    });

    it('should return json jobs', function (done) {
        var req = getReq();
        var res = getRes();

        mockJobModel.getJobsForUser = sinon.stub();
        mockJobModel.getJobsForUser.callsArgWith(2, null, jobs);
        controller.getJobsAlert(req, res);

        assert.calledOnce(res.json);
        assert.calledWith(res.json, getMockJsonResponse(jobs, ''));

        done();
    });
});


describe('Test getJob()', function () {
    it('should return a json error if jobs.getById fails', function (done) {
        var req = getReq();
        var res = getRes();

        mockJobModel.getById = sinon.stub();
        mockJobModel.getById.callsArgWith(1, error, null);

        controller.getJob(req, res);

        assert.calledOnce(res.json);
        assert.calledWith(res.json, {error: error.message});

        done();
    });

    it('should return a single job', function (done) {
        var req = getReq();
        var res = getRes();

        mockJobModel.getById = sinon.stub();
        mockJobModel.getById.callsArgWith(1, null, jobs[0]);

        controller.getJob(req, res);

        assert.calledOnce(res.json);
        assert.calledWith(res.json, jobs[0]);

        done();
    });
});

describe('Test getJobs()', function () {
    it('should return 404 getJobsForUser() fails', function (done) {
        var req = getReq();
        var res = getRes();

        mockJobModel.getJobsForUser = sinon.stub();
        mockJobModel.getJobsForUser.callsArgWith(2, error, null);
        res.status.withArgs(sinon.match(404)).returns(res);

        controller.getJobs(req, res);

        assert.calledWith(res.status, 404);
        assert.calledOnce(res.send);
        assert.notCalled(res.render);

        done();
    });

    it('should render the all jobs page', function (done) {
        var req = getReq();
        var res = getRes();

        var expectedJson = {
            title: process.conf.app.NAME,
            user: req.user,
            pageName: 'Jobs',
            jobs: jobs
        };

        mockJobModel.getJobsForUser = sinon.stub();
        mockJobModel.getJobsForUser.callsArgWith(2, null, jobs);

        controller.getJobs(req, res);

        assert.notCalled(res.status);
        assert.notCalled(res.send);
        assert.calledWith(res.render, 'jobs/all', expectedJson);

        done();
    });
});

function getReq() {
    return {
        user: {id: 1},
        params: {id: 2}
    }
}

function getRes() {
    return {
        json: sinon.spy(),
        render: sinon.spy(),
        status: sinon.stub(),
        send: sinon.spy()
    }
}

function getMockJsonResponse(jobs, message) {
    return {
        jobs: jobs,
        message: message
    }
}