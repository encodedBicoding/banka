import express from 'express';
import ValidateUser from '../config/validateUser';
import Login from '../controllers/login';
import Index from '../controllers/index';
import Accounts from '../controllers/Accounts';
import Validate from '../helpers/validate';
import Profile from '../helpers/profile';

const router = express.Router();


const routes = (app) => {
  router.get('/', Index.home);
  // User Login Routes
  router.get('/api/v1/login', Login.index);
  router.post('/api/v1/auth/login',
    ValidateUser.validateLogin,
    Login.login);
  // Admin Login routes
  router.post('/api/v1/auth/admin/login',
    ValidateUser.validateAdminLogin,
    Login.adminLogin);
  // Signup routes
  router.post('/api/v1/auth/signup',
    ValidateUser.signupInputField,
    ValidateUser.checkUserExists,
    ValidateUser.addToDatabase);

  // Accounts routes
  // Client create account
  router.post('/api/v1/:userId/accounts',
    Validate.validateUser,
    Accounts.createAccount);
  // Client get single account transaction
  router.get('/api/v1/:userId/accounts',
    Validate.validateUser,
    Accounts.getSingleAccount);
  // Only Admin / Staff can activate or deactivate account
  router.patch('/api/v1/:staffId/account/:accountId',
    Validate.validateStaff,
    Accounts.changeStatus);
  // Only Admin / staff can delete user account
  router.delete('/api/v1/:staffId/account/:accountId',
    Validate.validateStaff,
    Accounts.deleteAccount);
  // Only Staff can debit an account
  router.post('/api/v1/:staffId/transactions/:accountId/debit',
    Validate.validateStaff,
    Accounts.debitAccount);
  // Only Staff can credit an account
  router.post('/api/v1/:staffId/transactions/:accountId/credit',
    Validate.validateStaff,
    Accounts.creditAccount);
  // Only Admin can create staff account
  router.post('/api/v1/:staffId/create',
    Validate.validateAdmin,
    ValidateUser.addAdmin);
  // Api to allow client upload image
  router.put('/api/v1/client/:userId/uploads',
    Validate.validateUser,
    Profile.clientImageUpload);
  // Api to allow staff upload image
  router.put('/api/v1/staff/:staffId/uploads',
    Validate.validateStaff,
    Profile.staffImageUpload);

  router.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'no such endpoints on this server',
    });
  });

  app.use(router);
};
export default routes;
