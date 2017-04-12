/**
 *
 * Model that represents a job that's run on
 * the extractor API
 */

var converter = require('../util/conversion-util');
var Extractor = require('../helper/extractor');
var extractor = new Extractor();

var Job = module.exports = function Jobs(_job) {
    this._job = _job
};

// Public instance properties
Object.defineProperties(Job.prototype, {
    id: {
        get: function () { return this._job['id']; }
    },
    userId: {
        get: function () {return this._job['user_id']; }
    },
    name: {
        get: function () { return this._job['name']; }
    },
    status: {
        get: function () { return this._job['status']; }
    },
    type: {
        get: function () { return this._job['type']; }
    },
    isComplete: {
        get: function () {
            return converter.booleanToYesOrNo(this._job['complete']);
        }
    },
    isSuccess: {
        get: function() {
            return converter.booleanToYesOrNo(this._job['success']);
        }
    },
    startTime: {
        get: function () {
            return converter.timeSince(this._job['start_time']);
        }
    },
    endTime: {
        get: function () {
            return converter.timeSince(this._job['end_time']);
        }
    },
    totalTime: {
        get: function () {
            return this._job['total_time'].toString() + ' seconds';
        }
    }
});

// Public Instance Methods
Job.prototype.toJSON = function () {
    var job = {
        id: this.id,
        name: this.name,
        status: this.status,
        type: this.type,
        isComplete: this.isComplete,
        isSuccess: this.isSuccess,
        startTime: this.startTime,
        endTime: this.endTime,
        totalTime: this.totalTime
    };

    return job;
};

// Static methods
Job.getJobsForUser = function(userId, count, next) {

    extractor.getJobsForUser(userId, count, function (err, result) {

        if (err) {
            var error = new Error('Failed to load recent jobs');
            return next(error)
        } else if (!result.jobs.length) {
            var noJobError = new Error('No jobs found');
            return next(noJobError);
        } else {
            var jobs = [];

            result.jobs.forEach(function (job) {
               jobs.push(new Job(job));
            });

            next(null, jobs);
        }

    });
};

Job.getSummaryForUser = function(user_id, next) {
    extractor.getJobSummaryForUser(user_id)
        .then(result => {
            return next(null, result.summary);
        })
        .catch(err => {
            return next(err);
        });
};

Job.getById = function(id, next) {
    extractor.getJob(id)
        .then(job => {
            return next(null, new Job(job.jobs[0]));
        })
        .catch(err => {
            return next(err);
        });
};
