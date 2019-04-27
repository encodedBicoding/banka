"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _signup = _interopRequireDefault(require("../controllers/signup"));

var _login = _interopRequireDefault(require("../controllers/login"));

var _index = _interopRequireDefault(require("../controllers/index"));

var _Accounts = _interopRequireDefault(require("../controllers/Accounts"));

var _validate = _interopRequireDefault(require("../helpers/validate"));

var _authorize = _interopRequireDefault(require("../helpers/authorize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var routes = function routes(app) {
  router.get('/', _index["default"].home); // User Login Routes

  router.get('/api/v1/login', _login["default"].index);
  router.post('/api/v1/auth/login', _validate["default"].validateLoginForm, _validate["default"].validateLogin, _login["default"].clientLogin); // Admin Login routes

  router.post('/api/v1/auth/admin/login', _validate["default"].validateLoginForm, _validate["default"].validateAdminLogin, _login["default"].adminLogin); // Staff/Cashier Login routes

  router.post('/api/v1/auth/staff/login', _validate["default"].validateLoginForm, _validate["default"].validateAdminLogin, _login["default"].staffLogin); // Signup routes

  router.post('/api/v1/auth/signup', _validate["default"].validateSignupField, _validate["default"].checkUserExistence, _signup["default"].addToDatabase); // Accounts routes
  // Client create account

  router.post('/api/v1/accounts', _validate["default"].validateAccountForm, _authorize["default"].authenticateUser, _Accounts["default"].createAccount); // Client get all account transaction

  router.get('/api/v1/accounts', _authorize["default"].authenticateUser, _Accounts["default"].getAllAccount); // Client get single account transactions

  router.get('/api/v1/accounts/:accountId/transactions', _authorize["default"].authenticateUser, _Accounts["default"].getSingleAccountTransactions); // Only Admin / Staff can activate or deactivate account

  router.patch('/api/v1/accounts/:accountNumber', _authorize["default"].authenticateBothAdminAndStaff, _Accounts["default"].changeStatus); // Only Admin / staff can delete user account

  router["delete"]('/api/v1/accounts/:accountNumber', _authorize["default"].authenticateBothAdminAndStaff, _Accounts["default"].deleteAccount); // Only Staff can debit an account

  router.post('/api/v1/transactions/:accountNumber/debit', _validate["default"].validateAccountTransForm, _authorize["default"].authenticateStaff, _Accounts["default"].debitAccount); // Only Staff can credit an account

  router.post('/api/v1/transactions/:accountNumber/credit', _validate["default"].validateAccountTransForm, _authorize["default"].authenticateStaff, _Accounts["default"].creditAccount); // Only Admin can create staff account

  router.post('/api/v1/admin/create', _validate["default"].validateAdminSignupField, _authorize["default"].authenticateAdmin, _validate["default"].checkAdminExistence, _signup["default"].addAdmin); // Api to handle user password reset

  router.put('/api/v1/client/password_reset', _validate["default"].validatePasswordResetForm, _authorize["default"].authenticateUser, _Accounts["default"].resetPassword); // Api to handle staff password reset

  router.put('/api/v1/staff/password_reset', _validate["default"].validatePasswordResetForm, _authorize["default"].authenticateStaff, _Accounts["default"].resetPassword);
  router.use(function (req, res) {
    res.status(404).json({
      status: 404,
      message: 'no such endpoints on this server'
    });
  });
  app.use(router);
};

var _default = routes;
exports["default"] = _default;