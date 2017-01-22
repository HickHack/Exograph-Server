var Auth = module.exports = function () {}

Auth.checkAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

Auth.logout = function (req, res) {
    if (req.isAuthenticated()) {
        req.logout();
    }

    res.redirect('/login');
}