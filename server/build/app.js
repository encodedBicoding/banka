"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _config = _interopRequireDefault(require("./config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
(0, _config["default"])(app);
var PORT = process.env.PORT || 2042;
app.listen(PORT, console.log("app running on PORT ".concat(PORT)));
var _default = app;
exports["default"] = _default;