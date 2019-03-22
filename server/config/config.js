const bodyParser = require('body-parser'),
      session  = require('express-session'),
      cors = require('cors'),
      morgan = require('morgan'),
      nodemon = require('nodemon'),
      router = require('../routes/routes'),
      express = require('express');

module.exports = (app)=>{
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(morgan('dev'));
}