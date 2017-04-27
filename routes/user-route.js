var express = require('express');
var auth = require('../helper/auth');
var UserController = require('../controller/user-controller');

var router = express.Router();
var controller = new UserController();

router.get('/account', auth.checkAuth, function (req, res, next) {
    controller.getAccount(req, res, next);
});

router.get('/profile', auth.checkAuth, function (req, res, next) {
    controller.getProfile(req, res, next);
});

router.post('/profile/upload', auth.checkAuth, function (req, res, next) {
    controller.uploadImage(req, res, next);
});

router.post('/update', auth.checkAuth, function (req, res, next) {
    controller.updateAccount(req, res, next);
});

module.exports = router;