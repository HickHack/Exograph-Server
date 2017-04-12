/**
 * Created by graham on 12/04/17.
 */

var follower = require('../model/follower-model');

var FollowerController = module.exports = function FollowerController() {
};

FollowerController.prototype.getFollower = function (req, res) {

    follower.get(req.params['id'], function (err, result) {
        if (err) {
            var message = {message: 'Failed to load Follower'};
            res.send(JSON.stringify(message));
        } else {
            res.send(JSON.stringify(result));
        }
    });
};