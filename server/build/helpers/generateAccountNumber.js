"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var generateAccountNumber = function generateAccountNumber() {
  return Math.floor(Math.random() * 124323 / 60 * 60 * 60);
};

var _default = generateAccountNumber;
exports["default"] = _default;