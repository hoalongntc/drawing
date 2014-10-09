process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var socket = require('socket.io');
var colors = require('colors');
var redis = require('redis');
var config = require('config');
var async = require('async');

//-- Setup database
var DB = require('./models');
async.series([
    function(done) {
        DB.Users.sync().success(function() { done(); }).error(done);
    }
], function(err) {
    if(err) throw err;

    DB.sequelize
        .sync()
        .complete(function (err) {
            if (err) {
                console.log('DB Initialized: Failed');
                throw err[0];
            } else {
                console.log('DB Initialized: OK');
            }
        });
});

//-- Setup redis
var redisClient = redis.createClient(config.redis.port, config.redis.host, {
    auth_pass: config.redis.auth
});

redisClient.on('connect', function() {
    console.log('Redis client connected'.info);
});
redisClient.on('error', function(err) {
    console.log('Redis client get an error'.error);
    console.log((err + '').data);
});


//-- Setup color
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

//-- Setup request logger
logger.token('short-url', function(req, res) { return req.url.slice(0, 40) + '...'; });
logger = logger(
        ':remote-addr '.help +
        ':method '.debug +
        ':short-url ' +
        '=> '.data +
        ':status '.debug +
        'in '.data +
        ':response-time'.debug +
        'ms'.data);


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

//////////////////
//-- Express setup

var app = express();
var server = require('http').Server(app);
var io = socket(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/app/favicon.ico'));
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./controllers/sessionCtrl')(redisClient));

//-- Set routers
app.use('/', require('./routes/index')());
app.use('/', require('./routes/sessionRoutes')(redisClient));
app.use('/user', require('./routes/userRoutes')());
app.use('/friend', require('./routes/friendRoutes')());

//-- Set controllers
require('./controllers/socketCtrl')(io);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).send({ message: err.message, error: err });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send("Opp! Some things when wrong.");
});

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || process.env.OPENSHIFT_NODEJS_IP);
// The port on the DEA for communication with the application:
var port = (process.env.PORT || process.env.VCAP_APP_PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000);
// Start server
if(host) server.listen(port, host);
else server.listen(port);

console.log('Express server listening on port ' + port);
