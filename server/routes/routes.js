const validate = require('../config/validateUser'),
      index = require("../controllers/index"),
      login = require('../controllers/login'),
      account = require('../controllers/accounts'),
      isValid = require('../helpers/validate');

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

     //Create an account
    app.post('/api/v1/accounts',
            isValid.validateSession,
             account.createAccount);

    //Only Admin / Staff can activate or deactivate account
    app.patch('/api/v1/:staff_id/account/:account_id',
               isValid.validateSession,
               isValid.validateStaff,
               account.changeStatus);
    //Only Admin / Staff can delete user account
    app.delete('/api/v1/:staff_id/account/:account_id',
                isValid.validateSession,
                isValid.validateStaff,
                account.deleteAccount);
    //Only Admin / Staff can debit an account
    app.post('/api/v1/transactions/:account_id/debit',
             isValid.validateSession,
             isValid.validateStaff,
             account.debitAccount);

    app.use((req, res)=>{
        res.status(404).json({
            status: 404,
            message: 'no such endpoints on this server'
        })
    });
}
