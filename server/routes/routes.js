const validate = require('../config/validateUser'),
      index = require("../controllers/index"),
      login = require('../controllers/login'),
      account = require('../controllers/accounts'),
      isValid = require('../helpers/validate'),
      profile = require('../helpers/profile'),
      express = require('express'),
      router = express.Router();

module.exports = (app)=>{
    router.get('/',index.home);

    //Login Endpoints
    router.get('/login', login.index);
    router.post('/auth/login',
        validate.validateLogin,
        login.login);
    //Admin Login Endpoint
    router.post('/auth/admin/login',
            validate.validateAdminLogin,
            login.adminLogin);

    //Signup Endpoints
   router.post('/auth/signup',
                validate.checkUserExists,
                validate.addToDataBase);

   //Accounts Endpoints

     //Client Create an account
    router.post('/:user_id/accounts',
             account.createAccount);

    //Only Admin / Staff can activate or deactivate account
    app.patch('/:staff_id/account/:account_id',
               isValid.validateStaff,
               account.changeStatus);
    //Only Admin / Staff can delete user account
    router.delete('/:staff_id/account/:account_id',
                isValid.validateStaff,
                account.deleteAccount);
    //Only Admin / Staff can debit an account
    router.post('/:staff_id/transactions/:account_id/debit',
             isValid.validateStaff,
             account.debitAccount);
    //Only Admin / Staff can credit an account
    router.post('/:staff_id/transactions/:account_id/credit',
        isValid.validateStaff,
        account.creditAccount);
    //Only Admin can create staff account
    router.post('/:staff_id/create',
            isValid.validateAdmin,
            validate.addAdmin);

    //Api to allow client upload image
    router.put('/client/:user_id/uploads',
            isValid.validateUser,
            profile.clientImageUpload);
    //Api to allow staff upload image
    app.put('/staff/:staff_id/uploads',
        isValid.validateStaff,
        profile.staffImageUpload);

    router.use((req, res)=>{
        res.status(404).json({
            status: 404,
            message: 'no such endpoints on this server'
        })
    });
    app.use(router);
}
