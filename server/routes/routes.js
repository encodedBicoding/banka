import express from 'express';
import Signup from '../controllers/signup';
import Login from '../controllers/login';
import Index from '../controllers/index';
import Accounts from '../controllers/Accounts';
import Validate from '../helpers/validate';
import Authorize from '../helpers/authorize';


const router = express.Router();


const routes = (app) => {
  router.get('/', Index.home);

  // User Login Routes
  router.get('/api/v1/login', Login.index);
  router.post('/api/v1/auth/login',
    Validate.validateLoginForm,
    Validate.validateLogin,
    Login.login);

  // Admin Login routes
  router.post('/api/v1/auth/admin/login',
    Validate.validateLoginForm,
    Validate.validateAdminLogin,
    Login.adminLogin);

  // Staff/Cashier Login routes
  router.post('/api/v1/auth/staff/login',
    Validate.validateLoginForm,
    Validate.validateAdminLogin,
    Login.staffLogin);

  // Signup routes
  router.post('/api/v1/auth/signup',
    Validate.validateSignupField,
    Validate.checkUserExistence,
    Signup.addToDatabase);

  // Accounts routes
  // Client create account
  router.post('/api/v1/accounts',
    Validate.validateAccountForm,
    Authorize.authenticateUser,
    Accounts.createAccount);

  // Client get all account transaction
  router.get('/api/v1/accounts',
    Authorize.authenticateUser,
    Accounts.getAllAccount);

  // Client get single account transactions
  router.get('/api/v1/accounts/:accountId/transactions',
    Authorize.authenticateUser,
    Accounts.getSingleAccountTransactions);

  // Only Admin / Staff can activate or deactivate account
  router.patch('/api/v1/accounts/:accountId',
    Authorize.authenticateStaff,
    Accounts.changeStatus);

  // Only Admin / staff can delete user account
  router.delete('/api/v1/accounts/:accountId',
    Authorize.authenticateStaff,
    Accounts.deleteAccount);

  // Only Staff can debit an account
  router.post('/api/v1/transactions/:accountId/debit',
    Validate.validateAccountTransForm,
    Authorize.authenticateStaff,
    Accounts.debitAccount);

  // Only Staff can credit an account
  router.post('/api/v1/transactions/:accountId/credit',
    Validate.validateAccountTransForm,
    Authorize.authenticateStaff,
    Accounts.creditAccount);

  // Only Admin can create staff account
  router.post('/api/v1/admin/create',
    Validate.validateAdminSignupField,
    Authorize.authenticateAdmin,
    Signup.addAdmin);

  // Api to handle user password reset
  router.put('/api/v1/client/password_reset',
    Validate.validatePasswordResetForm,
    Authorize.authenticateUser,
    Accounts.resetPassword);

  // Api to handle staff password reset
  router.put('/api/v1/staff/password_reset',
    Validate.validatePasswordResetForm,
    Authorize.authenticateStaff,
    Accounts.resetPassword);


  router.use((req, res) => {
    res.status(404).json({
      status: 404,
      message: 'no such endpoints on this server',
    });
  });

  app.use(router);
};
export default routes;
