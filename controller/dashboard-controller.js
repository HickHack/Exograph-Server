var jobs = require('../model/job-model');

exports.getRoot  = function (req, res) {

    req.user.getNetworks(function (err, networks) {
        if (err) {
            res.status(500).send();
        } else {
            jobs.getSummaryForUser(req.user.id, function (err, summary) {
                if (err) {
                    res.status(404).send();
                } else {
                    res.render('graph/dashboard', {
                        title: process.conf.app.NAME,
                        pageName: 'Dashboard',
                        user: req.user,
                        networks: networks,
                        summary: summary
                    });
                }
            })
        }
    });
};
