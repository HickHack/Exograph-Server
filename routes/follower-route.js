/**
 * Created by graham on 12/04/17.
 */

var express = require('express');
var auth = require('../helper/auth');
var FollowerController = require('../controller/follower-controller');

var router = express.Router();
var controller = new FollowerController();

router.get('/:id', auth.checkAuth, function(req, res, next) {
    controller.getFollower(req, res);
});

module.exports = router;
