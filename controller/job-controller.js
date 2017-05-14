/**
 * Created by graham on 10/02/17.
 */

var job = require('../model/job-model');

exports.getJobsAlert = function (req, res, next) {

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

exports.getJobsView = function (req, res, next) {
    job.paginateByUser(req.user.id, 1, function (err, result) {
        if (err) {
            res.status(404).send();
        } else {
            res.render('jobs/all', {
                title: process.conf.app.NAME,
                user: req.user,
                pageName: 'Jobs',
                totalPages: result.pagination['num_pages']

            });
        }
    });
};

exports.paginateJobs = function (req, res, next) {
    var pageNum = parseInt(req.params['pageNum']);

    if (pageNum > 0) {
        job.paginateByUser(req.user.id, pageNum, function (err, result) {
            if (err) {
                res.json(getResponse([], "Something went wrong"));
            } else {
                res.json(getResponse(result.jobs, "", result.pagination));
            }
        });
    } else {
        res.json(getResponse([], "Invalid page number"));
    }
};

function getResponse(jobs, message, pagination) {
    return {
        jobs: jobs,
        message: message,
        pagination: pagination
    }
}

