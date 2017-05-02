/**
 * Created by graham on 01/05/17.
 */

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var config = require('../../config');
var UserController = require('../../controller/user-controller');

var describe = mocha.describe;
var it = mocha.it;
var assert = chai.assert;
var controller = new UserController();

process.conf = config;

describe('Pages should be rendered', function () {
    it('should render the account page', function (done) {
        var req = {user: ''};
        var res = {render: sinon.spy()};

        controller.getAccount(req, res);

        assert(res.render.calledOnce);
        assert(res.render.calledWith('user/account', {
            title: process.conf.app.NAME,
            user: req.user,
            pageName: 'Account Settings'
        }));

        done();
    });

    it('should render the profile page', function (done) {
        var req = {user: ''};
        var res = {render: sinon.spy()};

        controller.getProfile(req, res);

        assert(res.render.calledOnce);
        assert(res.render.calledWith('user/profile', {
            title: process.conf.app.NAME,
            user: req.user,
            pageName: 'Profile'
        }));

        done();
    });
});

describe('Testing user profile image upload', function () {

    function getRes() {
        return {json: sinon.spy()};
    }

    function getReq() {
        return {
            files: {image: {
                mimetype: 'image/png',
                mv: sinon.stub()
            }},
            user: {
                id: 1,
                hasProfileImage: false,
                patch: sinon.stub()
            }
        };

    }

    it('should fail because no image supplied', function (done) {
        var req = getReq();
        var res = getRes();

        req.files = null;

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'No image found'}
        ));

        done();
    });

    it('should fail because image type not PNG', function (done) {
        var req = getReq();
        var res = getRes();

        req.files.image.mimetype = 'image/jpg';

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'Invalid format, only PNG files accepted'}
        ));

        done();
    });


    it('should fail because moving image fails', function (done) {
        var req = getReq();
        var res = getRes();

        var path  = config.global.PATHS.PROFILE_IMG_DIR + req.user.id + '.png';
        req.files.image.mv.callsArgWith(1, {}, path);

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'Upload failed, please try again.'}
        ));

        done();
    });

    it('should fail because user patching fails', function (done) {
        var req = getReq();
        var res = getRes();

        var path  = config.global.PATHS.PROFILE_IMG_DIR + req.user.id + '.png';
        req.files.image.mv.callsArgWith(1, null, path);
        req.user.patch.callsArgWith(0, {});

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'Something went wrong'}
        ));

        done();
    });

    it('should fail because user patching fails', function (done) {
        var req = getReq();
        var res = getRes();

        var path  = config.global.PATHS.PROFILE_IMG_DIR + req.user.id + '.png';
        req.files.image.mv.callsArgWith(1, null, path);
        req.user.patch.callsArgWith(0, {});

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'Something went wrong'}
        ));

        done();
    });

    it('should fail because user patching fails', function (done) {
        var req = getReq();
        var res = getRes();

        var path  = config.global.PATHS.PROFILE_IMG_DIR + req.user.id + '.png';
        req.files.image.mv.callsArgWith(1, null, path);
        req.user.patch.callsArgWith(0, null);

        controller.uploadImage(req, res);

        assert(res.json.calledWith(
            {message: 'success'}
        ));

        done();
    });
});
