const bodyParser = require('body-parser'),
      session  = require('express-session'),
      cors = require('cors'),
      morgan = require('morgan'),
      router = require('../routes/routes'),
      express = require('express');

module.exports = (app)=>{
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({secret: 'password', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));
    app.use(morgan('dev'));
    router(app)
    return app;
}