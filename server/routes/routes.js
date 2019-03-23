const validate = require('../config/validateUser'),
      index = require("../controllers/index"),
      login = require('../controllers/login'),
      account =require('../controllers/accounts');

module.exports = (app)=>{
    app.get('/',index.home)

    //Login Endpoints
    app.get('/login', login.index);
    app.post('/api/v1/auth/login',
        validate.validateLogin,
        login.login);

    //Sign Endpoints
   app.post('/api/v1/auth/signup',
                validate.checkUserExists,
                validate.addToDataBase);

   //Accounts Endpoints
    app.post('/api/v1/:userid/accounts',
             account.createAccount);


    app.use((req, res)=>{
        res.status(404).json({
            status: 404,
            message: 'no such endpoints on this server'
        })
    });
}
