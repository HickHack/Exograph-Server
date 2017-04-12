var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport')
var session = require('express-session');
process.conf = require('./config');

//Routes
var graph = require('./routes/graph-route');
var dashboard = require('./routes/dashboard-route');
var user = require('./routes/user-route');
var job = require('./routes/job-route');
var connection = require('./routes/connection-route');
var follower = require('./routes/follower-route');

var app = express();

require('./helper/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Setup Passport and Flash
app.use(session({ secret: process.conf.global.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/login-route')(app, passport);
require('./routes/registration-route')(app, passport);

app.use('/graph', graph);
app.use('/', dashboard);
app.use('/dashboard', dashboard);
app.use('/job', job);
app.use('/user', user);
app.use('/connection', connection);
app.use('/follower', follower);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
