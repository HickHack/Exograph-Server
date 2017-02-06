var express = require('express');
var auth = require('../middleware/auth');
var converter = require('../util/conversionUtil');
var Extractor = require('../middleware/extractor');

var router = express.Router();
var extractor = new Extractor();

router.get('/', auth.checkAuth, function(req, res, next) {
    res.render('graph/graph', { title: process.conf.app.NAME });
});

router.get('/import', auth.checkAuth, function(req, res, next) {
    res.render('graph/import', {
        title: process.conf.app.NAME,
        user: req.user
    });
});

router.post('/import/linkedin', auth.checkAuth, function(req, res, next) {
    extractor.launchLinkedin({
        name: req.body.importName,
        username: req.body.linkedinEmail,
        password: req.body.linkedinPassword,
        user_id: req.user.id
    }, function (err, job) {
        if (err) {
            var error = {error: err.message};
            res.send(JSON.stringify(error));
        } else {
            converter.unixTimeToDateTime(job.start_time, function (date) {
                converter.formatDate(date, function (formatted) {
                    job.start_time = formatted;
                });
            });

            res.send(JSON.stringify(job));
        }
    });

});

module.exports = router;
