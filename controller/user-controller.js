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

