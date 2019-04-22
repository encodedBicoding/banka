"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _index = require("../postgresDB/DB/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    key: "clientLogin",
    value: async function clientLogin(req, res) {
      var _req$body = req.body,
          email = _req$body.email,
          password = _req$body.password;

      var token = _auth["default"].generateToken({
        email: email,
        password: password,
        isAdmin: false
      });

      try {
        var user = await _index.users.findByEmail('email, password', [email]);
        req.body.token = token;
        req.user = _auth["default"].verifyToken(token);
        res.status(200).json({
          status: 200,
          message: 'Log in successful',
          data: {
            user: user,
            token: token
          }
        });
      } catch (err) {
        res.status(400).json({
          status: err.statusCode,
          message: "Error: ".concat(err.message)
        });
      }
    }
  }, {
    key: "adminLogin",
    value: async function adminLogin(req, res) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password;

      var token = _auth["default"].generateToken({
        email: email,
        password: password,
        isAdmin: true,
        type: 'admin'
      });

      try {
        var user = await _index.staffs.findByEmail('email, password', [email]);
        req.body.token = token;
        req.user = _auth["default"].verifyToken(token);
        res.status(200).json({
          status: 200,
          message: 'Log in successful',
          data: {
            user: user,
            token: token
          }
        });
      } catch (err) {
        res.status(400).json({
          status: err.statusCode,
          message: "Error: ".concat(err.message)
        });
      }
    }
  }, {
    key: "staffLogin",
    value: async function staffLogin(req, res) {
      var _req$body3 = req.body,
          email = _req$body3.email,
          password = _req$body3.password;

      var token = _auth["default"].generateToken({
        email: email,
        password: password,
        isAdmin: true,
        type: 'staff'
      });

      try {
        var user = await _index.staffs.findByEmail('email, password', [email]);
        req.body.token = token;
        req.user = _auth["default"].verifyToken(token);
        res.status(200).json({
          status: 200,
          message: 'Log in successful',
          data: {
            user: user,
            token: token
          }
        });
      } catch (err) {
        res.status(400).json({
          status: err.statusCode,
          message: "Error: ".concat(err.message)
        });
      }
    }
  }]);

  return Login;
}();

var _default = Login;
exports["default"] = _default;