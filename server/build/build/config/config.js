"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _routes = _interopRequireDefault(require("../routes/routes"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var config = function config(app) {
  app.use((0, _cors["default"])());
  app.use((0, _cookieParser["default"])());
  app.use(_bodyParser["default"].json());
  app.use(_bodyParser["default"].urlencoded({
    extended: true
  }));
  app.use((0, _expressSession["default"])({
    secret: 'password',
    cookie: {
      maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
  }));
  (0, _routes["default"])(app);
};

var _default = config;
exports["default"] = _default;