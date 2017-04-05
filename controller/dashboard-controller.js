/**
 * Created by graham on 10/02/17.
 */
var jobs = require('../model/job-model');

var DashboardController = module.exports = function DashboardController() {};


DashboardController.prototype.handleInitialLoad  = function (req, res) {

    req.user.getNetworks(function (err, networks) {
        if (err) {
            // TODO Handle error
        } else {
            jobs.getSummaryForUser(req.user.id, function (err, summary) {
                if (err) {
                    // TODO: Handle error
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
