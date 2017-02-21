/**
 * Created by graham on 10/02/17.
 */

var job = require('../model/job-model');

var JobController = module.exports = function JobController() {};

JobController.prototype.handleJobsAlert = function(req, res, next) {

    job.getJobsForUser(req.user.id, 5, function (err, jobs) {
        var response = {};

        if (err) {
            var message = 'Failed to load recent jobs';
            response = getResponse([], message)
        } else {
            response = getResponse(jobs, '');
        }

        res.json(response);

        return next();
    });
};

function getResponse(jobs, message) {
    return {
        jobs: jobs,
        message: message
    }
};

