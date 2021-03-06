const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const clientRouter = require('./routes/client');
const eventRouter = require('./routes/event');
const eventTypeRouter = require('./routes/eventType');
const itemSelectRecordRouter = require('./routes/itemSelectRecord');
const payItemRouter = require('./routes/payItem');
const paymentRouter = require('./routes/payment');
const supplierRouter = require('./routes/supplier');
const venueRouter = require('./routes/venue');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/client', clientRouter);
app.use('/event', eventRouter);
app.use('/eventType', eventTypeRouter);
app.use('/itemSelectRecord', itemSelectRecordRouter);
app.use('/payItem', payItemRouter);
app.use('/payment', paymentRouter);
app.use('/supplier', supplierRouter);
app.use('/venue', venueRouter);

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
    res.json({
        message: err.message,
        error: err
    });
    // res.render('error');
});

module.exports = app;
