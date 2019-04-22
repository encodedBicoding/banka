"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = require("../postgresDB/DB/index");

var _util = _interopRequireDefault(require("./util"));

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
    value: async function setup(string) {
      var obj;

      for (var _len = arguments.length, argument = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        argument[_key - 1] = arguments[_key];
      }

      if (string === 'staff') {
        var email = argument[0],
            password = argument[1],
            firstname = argument[2],
            lastname = argument[3];

        var pass = _util["default"].hashPassword(password);

        try {
          obj = await _index.staffs.insert('firstname, lastname, email, password', [firstname, lastname, email, pass]);
        } catch (err) {
          throw err;
        }
      } else if (string === 'admin') {
        var _email = argument[0],
            _password = argument[1],
            _firstname = argument[2],
            _lastname = argument[3];

        var _pass = _util["default"].hashPassword(_password);

        try {
          obj = await _index.staffs.insert('fistname, lastname, email, password', [_firstname, _lastname, _email, _pass]);
        } catch (err) {
          throw err;
        }
      } else if (string === 'client') {
        var _email2 = argument[0],
            _password2 = argument[1],
            _firstname2 = argument[2],
            _lastname2 = argument[3];

        var _pass2 = _util["default"].hashPassword(_password2);

        try {
          obj = await _index.users.insert('firstname, lastname, email, password', [_firstname2, _lastname2, _email2, _pass2]);
        } catch (err) {
          throw err;
        }
      }

      return obj;
    }
  }]);

  return Acc;
}();

var _default = Acc;
exports["default"] = _default;