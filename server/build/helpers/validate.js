"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("./util"));

var _index = require("../postgresDB/DB/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class Validate
 */
var Validate =
/*#__PURE__*/
function () {
  function Validate() {
    _classCallCheck(this, Validate);
  }

  _createClass(Validate, null, [{
    key: "validateSignupField",

    /**
     * @description checks the user input field for error
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */
    value: function validateSignupField(req, res, next) {
      var _req$body = req.body,
          firstname = _req$body.firstname,
          lastname = _req$body.lastname,
          email = _req$body.email,
          password = _req$body.password;
      var nameTest = /^[A-z]{3,20}$/;
      var emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
      var passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
      var errArr = [];
      var errMsg;

      if (!nameTest.test(firstname) || firstname === undefined) {
        errArr.push('First name');
      }

      if (!nameTest.test(lastname) || lastname === undefined) {
        errArr.push('Last name');
      }

      if (!emailTest.test(email) || email === undefined) {
        errArr.push('Email');
      }

      if (!passText.test(password) || password === undefined) {
        errArr.push('Password');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
  }, {
    key: "checkAdminExistence",
    value: async function checkAdminExistence(req, res, next) {
      var email = req.body.email;

      try {
        var found = await _index.staffs.findByEmail('*', [email]);

        if (_typeof(found) !== 'object') {
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: 'A staff with the given email already exists'
          });
        }
      } catch (err) {
        res.status(err.statusCode).json({
          status: err.statusCode,
          message: "Error: ".concat(err.message)
        });
      }
    }
  }, {
    key: "checkUserExistence",
    value: async function checkUserExistence(req, res, next) {
      var email = req.body.email;

      try {
        var found = await _index.users.findByEmail('*', [email]);

        if (_typeof(found) !== 'object') {
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: 'A user with the given email already exists'
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: "Error: ".concat(err.message)
        });
      }
    }
  }, {
    key: "validateLoginForm",
    value: function validateLoginForm(req, res, next) {
      var emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
      var passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;
      var errArr = [];
      var errMsg;

      if (!emailTest.test(email) || email === undefined) {
        errArr.push('Email');
      }

      if (!passText.test(password) || password === undefined) {
        errArr.push('Password');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
    /**
     * @description validates user login details before calling next middleware
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "validateLogin",
    value: async function validateLogin(req, res, next) {
      var _req$body3 = req.body,
          email = _req$body3.email,
          password = _req$body3.password;

      try {
        var user = await _index.users.findByEmail('email, password', [email]);

        var match = _util["default"].validatePassword(password, user.password);

        if (match) {
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: 'email or password incorrect'
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: 'User does not exists'
        });
      }
    }
    /**
     * @description validates admin login details before calling next middleware
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "validateAdminLogin",
    value: async function validateAdminLogin(req, res, next) {
      var _req$body4 = req.body,
          email = _req$body4.email,
          password = _req$body4.password;

      try {
        var user = await _index.staffs.findByEmail('email, password', [email]);

        var match = _util["default"].validatePassword(password, user.password);

        if (match) {
          next();
        } else {
          res.status(400).json({
            status: 400,
            message: 'email or password incorrect'
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: 'User does not exists'
        });
      }
    }
  }, {
    key: "validateAccountForm",
    value: function validateAccountForm(req, res, next) {
      var _req$body5 = req.body,
          userType = _req$body5.userType,
          accType = _req$body5.accType;
      var errArr = [];
      var errMsg;
      var valueTest = /^([A-z]+)$/;

      if (!valueTest.test(userType) || userType === undefined) {
        errArr.push('User Type');
      }

      if (!valueTest.test(accType) || accType === undefined) {
        errArr.push('Account Type');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
    /**
     * @description checks the user input field for error
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "validateAdminSignupField",
    value: function validateAdminSignupField(req, res, next) {
      var _req$body6 = req.body,
          firstname = _req$body6.firstname,
          lastname = _req$body6.lastname,
          email = _req$body6.email,
          password = _req$body6.password,
          type = _req$body6.type;
      var nameTest = /^[A-z]{3,20}$/;
      var emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
      var passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
      var errArr = [];
      var errMsg;

      if (!nameTest.test(firstname) || firstname === undefined) {
        errArr.push('First name');
      }

      if (!nameTest.test(lastname) || lastname === undefined) {
        errArr.push('Last name');
      }

      if (!emailTest.test(email) || email === undefined) {
        errArr.push('Email');
      }

      if (!passText.test(password) || password === undefined) {
        errArr.push('Password');
      }

      if (!nameTest.test(type) || type === undefined) {
        errArr.push('Type');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
  }, {
    key: "validateAccountTransForm",
    value: function validateAccountTransForm(req, res, next) {
      var _req$body7 = req.body,
          amount = _req$body7.amount,
          accountnumber = _req$body7.accountnumber;
      var amountTest = /^([0-9.]+)$/;
      var accTest = /^([0-9]+)$/;
      var errArr = [];
      var errMsg;

      if (!amountTest.test(amount) || amount === undefined) {
        errArr.push('Amount');
      }

      if (!accTest.test(accountnumber) || accountnumber === undefined) {
        errArr.push('Account');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
  }, {
    key: "validatePasswordResetForm",
    value: function validatePasswordResetForm(req, res, next) {
      var _req$body8 = req.body,
          oldPassword = _req$body8.oldPassword,
          newPassword = _req$body8.newPassword;
      var errArr = [];
      var errMsg;
      var valueTest = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;

      if (!valueTest.test(oldPassword) || oldPassword === undefined) {
        errArr.push('Old Password');
      }

      if (!valueTest.test(newPassword) || newPassword === undefined) {
        errArr.push('New Password');
      }

      if (errArr.length > 1) {
        errMsg = errArr.join(' and ');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " fields are empty, missing or values not valid")
        });
      } else if (errArr.length === 1) {
        errMsg = errArr.join('');
        res.status(403).json({
          status: 403,
          message: "".concat(errMsg, " field is empty, missing or values not valid")
        });
      } else {
        next();
      }
    }
  }]);

  return Validate;
}();

var _default = Validate;
exports["default"] = _default;