const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const i18n = require('i18n');
require('dotenv').config();

var indexRouter = require('./src/routes/index');
var storeRouter = require('./src/routes/store');

var app = express();

app.use(cookieParser());

global.lang = process.env.DEFAULT_LANG

// app.use((req, res, next) => {
//   if (req.cookies.lang == null || req.cookies.lang == '') {
//     res.cookie('lang', process.env.DEFAULT_LANG, { maxAge: 900000 });
//     res.locals.lang = process.env.DEFAULT_LANG;
//   }
//   next();
// })

// Multi language


app.use(i18n.init);

i18n.configure({
  locales: ['th', 'en'],
  defaultLocale: process.env.DEFAULT_LANG,
  fallbacks: process.env.DEFAULT_LANG,
  retryInDefaultLocale: true,
  directory: __dirname + '/src/locales',
  cookie: 'lang',
});

app.use('/change-lang/:lang', (req, res) => {
  res.cookie('lang', req.params.lang, { maxAge: 900000 });
  global.lang = req.params.lang;
  res.locals.lang = req.params.lang;
  res.redirect('back');
});

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/store', storeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
