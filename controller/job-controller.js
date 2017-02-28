/**
 * Created by graham on 10/02/17.
 */

var job = require('../model/job-model');
var errors = require('../helper/errors');

var JobController = module.exports = function JobController() {};

JobController.prototype.handleJobsAlert = function(req, res, next) {

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

function getResponse(jobs, message) {
    return {
        jobs: jobs,
        message: message
    }
}

