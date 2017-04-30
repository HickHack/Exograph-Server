/**
 * Created by graham on 04/04/17.
 */

var UserController = module.exports = function UserController() {};

UserController.prototype.getAccount = function (req, res, next) {
    res.render('user/account', {
        title: process.conf.app.NAME,
        user: req.user,
        pageName: 'Account Settings'
    });

};

UserController.prototype.getProfile = function (req, res, next) {
    res.render('user/profile', {
        title: process.conf.app.NAME,
        user: req.user,
        pageName: 'Profile'
    });
};

UserController.prototype.uploadImage = function (req, res, next) {
    var acceptedFormats = ['image/png'];
    if (req.files.image) {
        var image = req.files.image;
        var relativePath = process.conf.global.PATHS.PROFILE_IMG_DIR + req.user.id + '.png';

        if (acceptedFormats.indexOf(image.mimetype) >= 0) {

            image.mv(relativePath, function (err) {
                if (err) {
                    res.json({message: 'Upload failed, please try again.'});
                } else {
                    req.user.hasProfileImage = true;
                    req.user.patch(function (err) {
                       if (err) {
                           res.json({message: 'Something went wrong'});
                       } else {
                           res.json({message: 'success'});
                       }
                    });
                }
            });
        } else {
            res.json({message: 'Invalid format, only PNG files accepted'});
        }
    } else {
        res.json({message: 'No image found'});
    }
};

UserController.prototype.updateAccount = function (req, res, next) {
    if (req.body) {
        req.user.patch(req.body, function (err) {
            if (err) {
                res.json({messages: [err]}).send();
            } else {
                res.json({messages: ['Account Update Successful']});
            }
        });
    }
};

UserController.prototype.updatePassword = function (req, res, next) {
    var oldPassword = req.body['old-password'];
    var newPassword = req.body['new-password'];
    var newPasswordConfirm = req.body['new-password-confirm'];
    var response = {
        message: '',
        type: 'danger'
    };

    if (oldPassword && newPassword && newPasswordConfirm) {
        req.user.updatePassword({
            oldPassword: oldPassword,
            newPassword: newPassword,
            newPasswordConfirm: newPasswordConfirm
        }, function (err) {
            if (err) {
                response.message = err;
                res.json(response).send();
            } else {
                response.message = 'Successfully updated password.';
                response.type = 'success';
                res.json(response);
            }
        });
    } else {
        response.message = 'Invalid parameters supplied.';
        res.json(response);
    }
};
