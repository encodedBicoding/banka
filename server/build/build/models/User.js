"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var User = function User(firstName, email, password, lastName) {
  _classCallCheck(this, User);

  this.id = 0;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.password = password;
  this.isAdmin = false;
};

var _default = User;
exports["default"] = _default;