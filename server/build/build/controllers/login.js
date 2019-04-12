"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _Database = _interopRequireDefault(require("../models/Database"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
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

var users = _Database["default"].users,
    staffs = _Database["default"].staffs;

var Login =
/*#__PURE__*/
function () {
  function Login() {
    _classCallCheck(this, Login);
  }

  _createClass(Login, null, [{
    key: "index",
    value: function index(req, res) {
      res.status(200).json({
        status: 200,
        message: 'Welcome to the login page'
      });
    }
  }, {
    key: "login",
    value: function login(req, res) {
      var _req$body = req.body,
          email = _req$body.email,
          password = _req$body.password;

      var token = _auth["default"].generateToken({
        email: email,
        password: password
      });

      var user = users.filter(function (u) {
        return u.email === email;
      });
      res.status(200).json({
        status: 200,
        data: [user[0], token]
      });
    }
  }, {
    key: "adminLogin",
    value: function adminLogin(req, res) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;

      var token = _auth["default"].generateToken({
        email: email,
        password: password,
        isAdmin: true
      });

      var staff = staffs.filter(function (s) {
        return s.email === email;
      });
      res.status(200).json({
        status: 200,
        data: [{
          staff: staff[0]
        }, token]
      });
    }
  }]);

  return Login;
}();

var _default = Login;
exports["default"] = _default;