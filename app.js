var createError = require('http-errors');
var path = require("path")
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var fileUpload = require("express-fileupload")

var session  = require("express-session")
var flash  = require("express-flash")

var indexRouter = require('./routes/index');
var issueBookRouter = require('./routes/issue-book');
var adminRouter = require('./routes/index');
var categoryRouter = require('./routes/category');
var bookRouter = require('./routes/book');
var userRouter = require('./routes/user');
var returnBookRouter = require('./routes/return-book');
var settingsRouter = require('./routes/settings');





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  name:"my_session",
  secret:"my_secret",
  resave:false,
  saveUninitialized:false
}))
app.use(flash())
app.use(fileUpload({
  createParentPath:true
}))
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//admin
app.use('/admin',express.static(path.join(__dirname,'public')))
app.use('/admin/:any',express.static(path.join(__dirname,'public')))



app.use('/', indexRouter);
app.use('/', adminRouter);
app.use('/', categoryRouter);
app.use('/', bookRouter);
app.use('/', userRouter);
app.use('/', issueBookRouter);
app.use('/', returnBookRouter);
app.use('/', settingsRouter);

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
