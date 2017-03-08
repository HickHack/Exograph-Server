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

JobController.prototype.getJob = function (req, res) {
    var id = req.params['id'];

    job.getById(id, function (err, job) {
       if (err) {
           res.send({error: err.message});
       } else {
            res.send(job)
       }

    });
};

function getResponse(jobs, message) {
    return {
        jobs: jobs,
        message: message
    }
}

