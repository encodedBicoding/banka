"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _validateUser = _interopRequireDefault(require("../config/validateUser"));

var _login = _interopRequireDefault(require("../controllers/login"));

var _index = _interopRequireDefault(require("../controllers/index"));

var _Accounts = _interopRequireDefault(require("../controllers/Accounts"));

var _validate = _interopRequireDefault(require("../helpers/validate"));

var _profile = _interopRequireDefault(require("../helpers/profile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

var routes = function routes(app) {
  router.get('/', _index["default"].home); // User Login Routes

  router.get('/api/v1/login', _login["default"].dbConnection);
  router.post('/api/v1/auth/login', _validateUser["default"].validateLogin, _login["default"].login); // Admin Login routes

  router.post('/api/v1/auth/admin/login', _validateUser["default"].validateAdminLogin, _login["default"].adminLogin); // Signup routes

  router.post('/api/v1/auth/signup', _validateUser["default"].signupInputField, _validateUser["default"].checkUserExists, _validateUser["default"].addToDatabase); // Accounts routes
  // Client create account

  router.post('/api/v1/accounts', _validate["default"].authenticateUser, _Accounts["default"].createAccount); // Client get single account transaction

  router.get('/api/v1/accounts', _validate["default"].authenticateUser, _Accounts["default"].getSingleAccount); // Only Admin / Staff can activate or deactivate account

  router.patch('/api/v1/accounts/:accountId', _validate["default"].authenticateStaff, _Accounts["default"].changeStatus); // Only Admin / staff can delete user account

  router["delete"]('/api/v1/accounts/:accountId', _validate["default"].authenticateStaff, _Accounts["default"].deleteAccount); // Only Staff can debit an account

  router.post('/api/v1/transactions/:accountId/debit', _validate["default"].authenticateStaff, _Accounts["default"].debitAccount); // Only Staff can credit an account

  router.post('/api/v1/transactions/:accountId/credit', _validate["default"].authenticateStaff, _Accounts["default"].creditAccount); // Only Admin can create staff account

  router.post('/api/v1/:staffId/create', _validate["default"].validateAdmin, _validate["default"].authenticateAdmin, _validateUser["default"].addAdmin); // Api to allow client upload image

  router.post('/api/v1/client/uploads', _validate["default"].authenticateUser, _profile["default"].imageUpload); // Api to allow staff upload image

  router.post('/api/v1/staff/:staffId/uploads', _validate["default"].validateStaff, _validate["default"].authenticateStaff, _profile["default"].imageUpload); // Api to handle user password reset

  router.put('/api/v1/client/password_reset', _validate["default"].authenticateUser, _Accounts["default"].resetPassword); // Api to handle staff password reset

  router.put('/api/v1/staff/password_reset', _validate["default"].authenticateStaff, _Accounts["default"].resetPassword);
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