/**
 * Created by graham on 12/04/17.
 */

var express = require('express');
var auth = require('../helper/auth');
var controller = require('../controller/follower-controller');

var router = express.Router();

router.get('/:id', auth.checkAuth, function(req, res, next) {
    controller.getFollower(req, res);
});

module.exports = router;
