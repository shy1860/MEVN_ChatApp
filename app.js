var express = require('express');
var createError = require('http-errors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var room = require('./routes/room');
var chat = require('./routes/chat');
var events = require('./routes/events');
var roomhistory = require('./routes/roomhistory');
//var messages = require('./routes/messages');

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://admin:admin@cluster0-shard-00-00-hyur7.mongodb.net:27017,cluster0-shard-00-01-hyur7.mongodb.net:27017,cluster0-shard-00-02-hyur7.mongodb.net:27017/mevn-chat?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/rooms', express.static(path.join(__dirname, 'dist')));
app.use('/api/room', room);
// app.use('/api/messages', messages)
app.use('/api/eventslog', events)
app.use('/api/chat', chat);
app.use('/api/history', chat);
app.use('/api/roomhistory', roomhistory);
// app.use('/api/chat', chat);
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
  res.send(err.status);
});

module.exports = app;
