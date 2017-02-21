var http = require('http');
var request = require('request');
var config = require('../config');

var endpoints = {};
var auth = {expire: '', token: ''};

var Extractor = module.exports = function Extractor() {
    obtainToken(function (err) {
        if (err) {
            console.log(err.message);
        } else {
            getEndpoints(function (err, result) {
                if (err) {
                    throw err;
                }

                endpoints = result;
            });
        }
    });
};

// Public methods
Extractor.prototype.launchLinkedin = function (props, next) {
    var req = getRequest(endpoints['run_linkedin'], 'POST');
    req.body = JSON.stringify(props);

    performRequest(req, function (err, res) {
        if (err) {
            var error = new Error('Oops something went wrong!');
            return next(error);
        }

        if (res.statusCode == 200) {
            parseJSONResponse(res, function (err, result) {
                if (err) return next(err);

                if (result.jobs.length > 0) {
                    return next(null, result.jobs[0]);
                } else {
                    var noJobError = new Error('Failed to trigger job');
                    return next(noJobError);
                }
            });
        }
    });
};

Extractor.prototype.getJobsForUser = function (userId, count, next) {
    var url = endpoints['job_by_user_id']+  userId + '?count=' + count;
    var req = getRequest(url, 'GET');

    performRequest(req, function (err, res) {
        if(err) {
            var error = new Error('Oops something went wrong!');
            return next(error);
        }

        if (res.statusCode == 200) {
            parseJSONResponse(res, function (err, jobs) {
                if (err) return next(err);

                return next(null, jobs);
            });
        } else {
            var error = new Error('Problem loading jobs ' + res.statusCode);
            return next(error);
        }

    });
};



// Private helpers
function performRequest(req, callback) {
    validateToken(function () {
        console.log("Extractor request: " + req.url + " " + req.method);
        req.headers.Authorization = auth.token;

        request(req, function (err, res, body) {
            if (err) return callback(err);

            return callback(null, res)
        });
    });
}

function validateToken(next) {
    var now = new Date();

    if (auth.token == '' || now.getTime() > auth.expire.getTime()) {
        obtainToken(function (err) {
            if (err) {
               console.log("Token refresh error: " + err);
            }

            return next();
        });
    }

    return next();
}

function obtainToken(next) {
    var req = getRequest(config.global.EXTRACTOR_TOKEN_URL, 'POST');
    req.body = JSON.stringify(config.global.EXTRACTOR_LOGIN);

    request(req, function (err, res, body) {
        if (err) {
            console.log('Error obtaining token: ' + err);
            return next(err);
        }

        if (res.statusCode == 200 && res.headers['content-type'] == 'application/json') {

            var result = JSON.parse(body);

            if (result['token']) {

                var date = new Date();
                date.setMinutes(date.getMinutes() + 25);

                auth.token = 'Bearer ' + result['token'];
                auth.expire = date;

                console.log('Token obtained');
                return next(null);
            }
        }
    });
}

function getEndpoints(next) {
    var req = getRequest('http://localhost:8000/api/v1/endpoints', 'GET');

    performRequest(req, function (err, res) {
        if (err) return next(err);

        if (res.statusCode == 200) {
            parseJSONResponse(res, function (err, obj) {
                return next(null, obj);
            });

        } else {
            var error = new Error('Failed to fetch endpoints');
            return next(error);
        }
    });
}

function getRequest(url, method) {

    return {
        headers: {
            'Content-Type': 'application/json'
        },
        url: url,
        method: method,
        body: ''
    }
}

function parseJSONResponse(res, next) {
    if (res.headers['content-type'] == 'application/json') {
        return next(null, JSON.parse(res.body));
    }

    var err = new Error('Unable to parse response, body is not json');
    return next(err);
}