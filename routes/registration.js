var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('registration/register', { title: 'Exograph' });
});

router.route('/').post(function (req, res) {
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var company = req.body.company;
  var country = req.body.country;
  var email = req.body.email;
  var password = req.body.password;

  if (firstname == '' || surname == '' || company == '' ||
      country == '' || email == '' || password == '') {
    res.render('registration/register', { error: 'Please complete all fields' });
  }


});

module.exports = router;
