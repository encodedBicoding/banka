const validate = require('../config/validateUser'),
      index = require("../controllers/index"),
      login = require('../controllers/login'),
      account = require('../controllers/accounts'),
      isValid = require('../helpers/validate'),
      profile = require('../helpers/profile');

module.exports = (app)=>{
    app.get('/',index.home);

    //Login Endpoints
    app.get('/login', login.index);
    app.post('/api/v1/auth/login',
        validate.validateLogin,
        login.login);
    //Admin Login Endpoint
    app.post('/api/v1/auth/admin/login',
            validate.validateAdminLogin,
            login.adminLogin);

    //Signup Endpoints
   app.post('/api/v1/auth/signup',
                validate.checkUserExists,
                validate.addToDataBase);

   //Accounts Endpoints

     //Client Create an account
    app.post('/api/v1/accounts',
             account.createAccount);

    //Only Admin / Staff can activate or deactivate account
    app.patch('/api/v1/:staff_id/account/:account_id',
               isValid.validateStaff,
               account.changeStatus);
    //Only Admin / Staff can delete user account
    app.delete('/api/v1/:staff_id/account/:account_id',
                isValid.validateStaff,
                account.deleteAccount);
    //Only Admin / Staff can debit an account
    app.post('/api/v1/:staff_id/transactions/:account_id/debit',
             isValid.validateStaff,
             account.debitAccount);
    //Only Admin / Staff can credit an account
    app.post('/api/v1/:staff_id/transactions/:account_id/credit',
        isValid.validateStaff,
        account.creditAccount);
    //Only Admin can create staff account
    app.post('/api/v1/:staff_id/create',
            isValid.validateAdmin,
            validate.addAdmin);

    //Api to allow client upload image
    app.put('/api/v1/client/:user_id/uploads',
            isValid.validateUser,
            profile.clientImageUpload);
    //Api to allow staff upload image
    app.put('/api/v1/client/:staff_id/uploads',
        isValid.validateStaff,
        profile.staffImageUpload);

    app.use((req, res)=>{
        res.status(404).json({
            status: 404,
            message: 'no such endpoints on this server'
        })
    });
}
