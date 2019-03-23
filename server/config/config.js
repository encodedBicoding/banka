const bodyParser = require('body-parser'),
      session  = require('express-session'),
      path = require('path'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      morgan = require('morgan'),
      router = require('../routes/routes');

module.exports = (app)=>{
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({secret: 'password', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));
    app.use(morgan('dev'));
    router(app)
    return app;
}