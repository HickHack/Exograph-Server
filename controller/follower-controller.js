var follower = require('../model/follower-model');

exports.getFollower = function (req, res) {

    follower.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Follower'};
            res.json(message);
        } else {
            res.json(result);
        }
    });
};