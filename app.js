var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;

var bodyParser = require('body-parser');
var flash = require('connect-flash');

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://10.23.7.8');
var mqttList = [[], []];
var mqttObj = {};
var mattSeq = [0, 0];
var no_x, no_y, no_z;
var deviceList = ['b0b448bfb385', 'b0b448d6b286'];

client.subscribe('sensors/#');

client.on('message', function(topic, message) {
    var topicList = topic.split('/');
    
    for (var i = 0; i < deviceList.length; i++) {
        var device = deviceList[i];
        if(device == topicList[1]) {
            var obj = message.toLocaleString();
            var no = (parseFloat(Math.round(obj.split(':')[0] * 100) / 100).toFixed(2) * 100) - 400;
            //if(device == 'b0b448bfb385') {
                if(topicList[2] == 'x-axis') {
                    no_x = no;
                    
                } else if(topicList[2] == 'y-axis') {
                    no_y = no;
                    
                } else if(topicList[2] == 'z-axis') {
                    no_z = no;
                        
                    mqttList[i][mattSeq[i]] = [mattSeq[i] + 1, no_x, no_y, no_z];
                    mattSeq[i]++;
                }
                
                if(mqttList[i].length > 500) {
                    mqttList[i].splice(0, 250);
                }
                eval('mqttObj.' + device + ' = mqttList[i];');
            //}
            
        }    
    }
    
    
});

var app = express();

app.use(function(req,res,next){
    req.mqttObj = mqttObj;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handler express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// router js
var routes = require('./routes/index');
var about = require('./routes/about');
var mqttSubscriber = require('./routes/mqttSubscriber');

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
          param: formParam,
          msg: msg,
          value: value  
        };
    }
}));

// flash
app.use(flash());
app.use(function(req, res, next) {
   res.locals.messages = require('express-messages')(req, res);
   next(); 
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/about', about);
app.use('/mqttSubscriber', mqttSubscriber);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;