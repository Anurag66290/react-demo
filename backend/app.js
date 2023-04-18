var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT
var mongoURI = require('./config/db_config').mongo;
var apiRouter = require('./routes/api');

var app = express();
const server = require('http').Server(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));


app.use(logger('dev'));
app.use(express.json());

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.use('/node_modules_url', express.static(path.join(__dirname, 'node_modules')));
app.use('/', express.static(path.join(__dirname, '/build')));
app.use('/*', express.static(path.join(__dirname, '/build')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', function (err) {
    console.log(err);
    console.log('error in connecting, process is exiting ...');
    process.exit(); 
});

mongoose.connection.once('open', function () {
    console.log('Successfully connected to database');
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


server.listen(PORT, (req, res) => {
  console.log(`Server Start Successfully ${PORT}`);
})


module.exports = app;