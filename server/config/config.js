const bodyParser = require('body-parser'),
      session  = require('express-session'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      router = require('../routes/routes');

module.exports = (app)=>{
    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(session({secret: 'password', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}));
    router(app)
    return app;
}