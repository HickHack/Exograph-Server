var http = require('http');
var request = require('request');
var config = require('../config');

var endpoints = {};
var auth = {expire: '', token: ''};

var Extractor = module.exports = function Extractor() {
    obtainToken()
        .then(() => {
            getEndpoints()
                .then(results => {
                    endpoints = results
                })
                .catch(err => {
                    console.warn('Failed to obtain API endpoints: ' + err.stack);
                    process.exit();
                });
        })
        .catch(error => {
            console.warn('Couldn\'t obtain token: ' + error.message);
            process.exit();
        });
};

// Public methods
Extractor.prototype.launchLinkedin = function (props, next) {
    var req = getRequest(endpoints['run_linkedin'], 'POST');
    req.body = JSON.stringify(props);

    performRequest(req)
        .then(result => {
            if (result.jobs.length > 0) {
                return next(null, result.jobs[0]);
            } else {
                var noJobError = new Error('Failed to trigger job');
                return next(noJobError);
            }
        })
        .catch(() => {
            var error = new Error('Oops something went wrong!');
            return next(error);
        });
};

Extractor.prototype.getJobsForUser = function (userId, count, next) {
    var url = endpoints['job_by_user_id'] + userId + '?count=' + count;
    var req = getRequest(url, 'GET');

    performRequest(req)
        .then(jobs => {
            return next(null, jobs);
        })
        .catch(() => {
            var error = new Error('Problem loading jobs');
            return next(error);
        });
};

Extractor.prototype.getJob = function (id) {
    var url = endpoints['job_by_id'].replace('<id>', id);
    var req = getRequest(url, 'GET');

    return new Promise((resolve, reject) => {
        performRequest(req)
            .then(job => {
                resolve(job);
            })
            .catch(() => {
                var error = new Error('Problem loading job');
                reject(error);
            });
    });
};

// Private helpers
function performRequest(req) {

    return new Promise((resolve, reject) => {
        validateToken()
            .then(() => {
                console.log("Extractor request: " + req.url + " " + req.method);
                req.headers.Authorization = auth.token;

                request(req, function (err, res, body) {
                    if (err) {
                        reject(err);
                    } else if (res.statusCode == 200) {
                        parseJSONResponse(res)
                            .then(obj => {
                                resolve(obj);
                            }).catch(error => {
                            reject(error);
                        });
                    }

                });
            })
            .catch(err => {
                console.log('Request error: ' + JSON.stringify(req));
                reject(err);
            });
    });
}

function validateToken() {
    var now = new Date();

    return new Promise((resolve, reject) => {
        if (auth.token == '' || now.getTime() >= auth.expire.getTime()) {
            obtainToken()
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            resolve();
        }
    });
}

function obtainToken() {
    var req = getRequest(config.global.EXTRACTOR_TOKEN_URL, 'POST');
    req.body = JSON.stringify(config.global.EXTRACTOR_LOGIN);

    return new Promise((resolve, reject) => {
        request(req, function (err, res, body) {
            if (err) {
                reject(err);
            } else if (res.statusCode == 200 && res.headers['content-type'] == 'application/json') {

                var result = JSON.parse(body);

                if (result['token']) {

                    var expireTime = new Date();
                    expireTime.setMinutes(expireTime.getMinutes() + 5);

                    auth.token = 'Bearer ' + result['token'];
                    auth.expire = expireTime;

                    console.log('Token obtained');
                    resolve();
                }
            }
        });
    });
}

function getEndpoints() {
    var req = getRequest('http://localhost:8000/api/v1/endpoints', 'GET');

    return new Promise((resolve, reject) => {
        performRequest(req)
            .then(endpoints => {
                resolve(endpoints);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function parseJSONResponse(res) {
    return new Promise((resolve, reject) => {
        if (res.headers['content-type'] == 'application/json') {
            resolve(JSON.parse(res.body));
        } else {
            var err = new Error('Unable to parse response, body is not json')
            reject(err);
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
