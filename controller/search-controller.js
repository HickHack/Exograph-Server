/**
 * Created by graham on 07/05/17.
 */

exports.performSearch = function (req, res, next) {

    if (req.query.q && req.query.q != '') {
        var query = req.query.q.toLowerCase();

        req.user.getNetworksByQuery(query, function (err, networks) {
            if (err) {
                res.status(500).send();
            } else {
                res.render('graph/search', {
                    title: process.conf.app.NAME,
                    pageName: 'Search results for "'+ query +'" ',
                    user: req.user,
                    networks: networks,
                    jobs: []
                });
            }
        });
    } else {
        res.redirect('/dashboard');
    }
};