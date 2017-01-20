var auth = require('../middleware/auth');

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/', auth.isLoggedIn, function(req, res, next) {
        res.render('index', { title: 'Exograph' });
    });
}

