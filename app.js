var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session"); // Corrected import name
const passport = require('passport');
const User = require('./routes/users'); // Import the user model
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const flash = require("connect-flash");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// Session configuration
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "om namhaa shivay",
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser()); // Use User model
passport.deserializeUser(User.deserializeUser());

// Other middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
