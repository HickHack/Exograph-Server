/**
 * Created by graham on 07/02/17.
 */

var express = require('express');
var auth = require('../helper/auth');
var controller = require('../controller/dashboard-controller');

var router = express.Router();

router.get('/', auth.checkAuth, function(req, res) {
    controller.getRoot(req, res);
});

module.exports = router;