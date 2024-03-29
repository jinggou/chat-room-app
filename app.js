const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { DateTime } = require('luxon');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

const { Message } = require('./models/message');

const PORT = 3000;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('new message', async ({username, content}) => {
    const timestamp = new Date();
    const timestamp_formatted = DateTime.fromJSDate(timestamp).toLocaleString(DateTime.DATETIME_SHORT);
    io.emit('new message', { username, content, timestamp_formatted });

    const newMessage = new Message({ username, content, timestamp });
    await newMessage.save();
  });
});

http.listen(PORT, () => {
  console.log('listening on:', PORT);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

// mongoose connection setup
const mongoose = require('mongoose');
// const uri = 'mongodb+srv://admin:admin@cluster0.puvzp.mongodb.net/chatroom?retryWrites=true&w=majority';
const uri = 'mongodb://localhost:27017/chatroom';
mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;