/**
 * Created by graham on 10/02/17.
 */

var job = require('../model/job-model');
var errors = require('../helper/errors');

var JobController = module.exports = function JobController() {};

JobController.prototype.getJobsAlert = function(req, res, next) {

    job.getJobsForUser(req.user.id, 5, function (err, jobs) {
        var response = {};

        if (err) {
            response = getResponse([], err.message)
        } else {
            response = getResponse(jobs, '');
        }

        res.send(response);
    });
};

JobController.prototype.getJob = function (req, res, next) {
    var id = req.params['id'];

    job.getById(id, function (err, job) {
       if (err) {
           res.send({error: err.message});
       } else {
            res.send(job)
       }

    });
};

JobController.prototype.getJob = function (req, res, next) {
    var id = req.params['id'];

    job.getById(id, function (err, job) {
        if (err) {
            res.send({error: err.message});
        } else {
            res.send(job)
        }

    });
};

JobController.prototype.getJobs = function (req, res, next) {

    job.getJobsForUser(req.user.id, -1, function (err, jobs) {
        if (err) {
            // TODO: Add error widget response
            throw new Error('Get All jobs failed');
        } else {
            res.render('jobs/all', {
                title: process.conf.app.NAME,
                user: req.user,
                pageName: 'Jobs',
                jobs: jobs
            });
        }

    });
};

function getResponse(jobs, message) {
    return {
        jobs: jobs,
        message: message
    }
}

