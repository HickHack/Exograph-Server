/**
 * Created by graham on 10/02/17.
 */

var job = require('../model/job-model');

exports.getJobsAlert = function(req, res, next) {

    job.getJobsForUser(req.user.id, 5, function (err, jobs) {
        var response = {};

        if (err) {
            response = getResponse([], err.message)
        } else {
            response = getResponse(jobs, '');
        }

        res.json(response);
    });
};

exports.getJob = function (req, res, next) {
    var id = req.params['id'];

    job.getById(id, function (err, job) {
       if (err) {
           res.json({error: err.message});
       } else {
            res.json(job)
       }

    });
};

exports.getJobs = function (req, res, next) {

    job.getJobsForUser(req.user.id, -1, function (err, jobs) {
        if (err) {
            res.status(404).send();
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

