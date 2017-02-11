/**
 * Created by graham on 10/02/17.
 */

var converter = require('../util/conversionUtil');
var Extractor = require('../helper/extractor');

var extractor = new Extractor();

var GraphController = module.exports = function GraphController() {};

GraphController.prototype.handleImport = function(req, res) {
    res.render('graph/import', {
        title: process.conf.app.NAME,
        pageName: 'Import',
        user: req.user
    });
};

GraphController.prototype.launchLinkedinImport = function (req, res){
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
};