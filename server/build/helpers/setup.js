"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Database = _interopRequireDefault(require("../models/Database"));

var _util = _interopRequireDefault(require("./util"));

var _Client = _interopRequireDefault(require("../models/Client"));

var _Admin = _interopRequireDefault(require("../models/Admin"));

var _Staff = _interopRequireDefault(require("../models/Staff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Acc =
/*#__PURE__*/
function () {
  function Acc() {
    _classCallCheck(this, Acc);
  }

  _createClass(Acc, null, [{
    key: "setup",
    value: function setup(string) {
      var obj;

      for (var _len = arguments.length, argument = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        argument[_key - 1] = arguments[_key];
      }

      if (string === 'staff') {
        var id = _Database["default"].staffs.length + 1;
        var email = argument[0],
            password = argument[1],
            firstName = argument[2];

        var pass = _util["default"].hashPassword(password);

        var newStaff = new _Staff["default"](firstName, email, pass);
        newStaff.id = id;

        _Database["default"].staffs.push(newStaff);

        obj = newStaff;
      } else if (string === 'admin') {
        var _id = _Database["default"].staffs.length + 1;

        var _email = argument[0],
            _password = argument[1],
            _firstName = argument[2];

        var _pass = _util["default"].hashPassword(_password);

        var newAdmin = new _Admin["default"](_firstName, _email, _pass);
        newAdmin.id = _id;

        _Database["default"].staffs.push(newAdmin);

        obj = newAdmin;
      } else if (string === 'client') {
        var _id2 = _Database["default"].users.length + 1;

        var _email2 = argument[0],
            _password2 = argument[1],
            _firstName2 = argument[2],
            lastName = argument[3];

        var _pass2 = _util["default"].hashPassword(_password2);

        var newClient = new _Client["default"](_firstName2, _email2, _pass2, lastName);
        newClient.id = _id2;

        _Database["default"].users.push(newClient);

        obj = newClient;
      }

      return obj;
    }
  }]);

  return Acc;
}();

var _default = Acc;
exports["default"] = _default;