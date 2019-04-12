"use strict";

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Database = _interopRequireDefault(require("../models/Database"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _util = _interopRequireDefault(require("../helpers/util"));

var _Client = _interopRequireDefault(require("../models/Client"));

var _Admin = _interopRequireDefault(require("../models/Admin"));

var _Staff = _interopRequireDefault(require("../models/Staff"));

var _setup = _interopRequireDefault(require("../helpers/setup"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/**
 * @class ValidateUser
 */


var ValidateUser =
/*#__PURE__*/
function () {
  function ValidateUser() {
    _classCallCheck(this, ValidateUser);
  }

  _createClass(ValidateUser, null, [{
    key: "validateLogin",

    /**
     * @description validates user login details before calling next middleware
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */
    value: function validateLogin(req, res, next) {
      var _req$body = req.body,
          email = _req$body.email,
          password = _req$body.password;

      var user = _Database["default"].users.filter(function (u) {
        return u.email === email;
      });

      if (user.length <= 0 || !_util["default"].validatePassword(password, user[0].password)) {
        res.status(404).json({
          status: 404,
          message: 'email or password not found'
        });
      } else {
        next();
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
    value: function validateAdminLogin(req, res, next) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;

      var staff = _Database["default"].staffs.filter(function (s) {
        return s.email === email;
      });

      if (staff.length <= 0 || !_util["default"].validatePassword(password, staff[0].password)) {
        res.status(404).json({
          status: 404,
          message: 'email or password not found'
        });
      } else {
        next();
      }
    }
    /**
     * @description checks if user exists returns error if true or next if false
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "checkUserExists",
    value: function checkUserExists(req, res, next) {
      var email = req.body.email;

      var found = _Database["default"].users.find(function (user) {
        return user.email === email;
      });

      if (_typeof(found) !== 'object') {
        next();
      } else {
        res.status(401).json({
          status: 401,
          message: 'A user with the given email already exists'
        });
      }
    }
    /**
     * @description adds a new user to the database
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "addToDatabase",
    value: function addToDatabase(req, res) {
      var _req$body3 = req.body,
          firstName = _req$body3.firstName,
          email = _req$body3.email,
          password = _req$body3.password,
          lastName = _req$body3.lastName;

      var token = _auth["default"].generateToken({
        email: email,
        firstName: firstName
      });

      var user = _setup["default"].setup('client', email, password, firstName, lastName);

      res.status(201).json({
        status: 201,
        message: 'Account created successfully',
        data: [user, token]
      });
    }
    /**
     * @description adds new admin to the database
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "addAdmin",
    value: function addAdmin(req, res) {
      var _req$body4 = req.body,
          firstName = _req$body4.firstName,
          email = _req$body4.email,
          type = _req$body4.type,
          password = _req$body4.password;

      var staff = _Database["default"].staffs.filter(function (s) {
        return s.email === email;
      });

      if (staff.length <= 0) {
        if (type === 'staff') {
          var token = _auth["default"].generateToken({
            email: email,
            firstName: firstName,
            isAdmin: true,
            type: 'staff'
          });

          var newStaff = _setup["default"].setup('staff', email, password, firstName);

          res.status(201).json({
            status: 201,
            data: [newStaff, token]
          });
        } else if (type === 'admin') {
          var _token = _auth["default"].generateToken({
            email: email,
            firstName: firstName,
            isAdmin: true,
            type: 'admin'
          });

          var newAdmin = _setup["default"].setup('admin', email, password, firstName);

          res.status(201).json({
            status: 201,
            data: [newAdmin, _token]
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          message: 'Email already exists'
        });
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
    key: "signupInputField",
    value: function signupInputField(req, res, next) {
      var _req$body5 = req.body,
          firstName = _req$body5.firstName,
          email = _req$body5.email,
          lastName = _req$body5.lastName,
          password = _req$body5.password;
      var nameTest = /^[A-z]{3,20}$/;
      var emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
      var passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;

      if (!nameTest.test(firstName) || !nameTest.test(lastName) || !emailTest.test(email) || !passText.test(password)) {
        res.status(403).json({
          status: 403,
          message: 'Please check that all fields are filled'
        });
      } else {
        next();
      }
    }
  }]);

  return ValidateUser;
}();

var _default = ValidateUser;
exports["default"] = _default;