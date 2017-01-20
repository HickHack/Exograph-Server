var Auth = module.exports = function () {}

Auth.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

Auth.logout = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.logout();
        next(null, true);
    } else {
        next(null, false);
    }
}