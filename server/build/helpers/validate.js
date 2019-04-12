"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Database = _interopRequireDefault(require("../models/Database"));

var _auth = _interopRequireDefault(require("./auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var users = _Database["default"].users,
    staffs = _Database["default"].staffs;
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
    key: "validateStaff",

    /**
     * @description verify staff authenticity before executing next middleware
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */
    value: function validateStaff(req, res, next) {
      var staffId = req.params.staffId;
      var staff = staffs.filter(function (s) {
        return s.id === Number(staffId) && s.isAdmin === true;
      });

      if (staff.length <= 0) {
        res.status(401).json({
          status: 401,
          message: 'Not Authorized'
        });
      } else {
        next();
      }
    }
    /**
     * @description verify admin authenticity before executing next middleware
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "validateAdmin",
    value: function validateAdmin(req, res, next) {
      var staffId = req.params.staffId;
      var staff = staffs.filter(function (s) {
        return s.id === Number(staffId) && s.type === 'admin';
      });

      if (staff.length <= 0) {
        res.status(401).json({
          status: 401,
          message: 'Not Authorized'
        });
      } else {
        next();
      }
    }
    /**
     * @description uses JWT to validate user authenticity
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "authenticateUser",
    value: function authenticateUser(req, res, next) {
      var token = req.headers.authorization.split(' ')[1];

      if (!_auth["default"].verifyToken(token)) {
        res.status(401).json({
          status: 401,
          message: 'Incorrect token supplied'
        });
      } else {
        var payload = _auth["default"].verifyToken(token);

        if (!payload.email) {
          res.status(401).json({
            status: 401,
            message: 'Not Authorized'
          });
        } else {
          next();
        }
      }
    }
    /**
     * @description uses JWT to validate staff authenticity
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "authenticateStaff",
    value: function authenticateStaff(req, res, next) {
      var token = req.headers.authorization.split(' ')[1];

      if (!_auth["default"].verifyToken(token)) {
        res.status(401).json({
          status: 401,
          message: 'Not authorized'
        });
      } else {
        var payload = _auth["default"].verifyToken(token);

        var isAdmin = payload.isAdmin;

        if (isAdmin !== true) {
          res.status(401).json({
            status: 401,
            message: 'Not authorized'
          });
        } else {
          next();
        }
      }
    }
    /**
     * @description uses JWT to validate admin authenticity
     * @param req express request object
     * @param res express response object
     * @param next express next to execute next middleware
     * @returns {object} JSON
     */

  }, {
    key: "authenticateAdmin",
    value: function authenticateAdmin(req, res, next) {
      var token = req.headers.authorization.split(' ')[1];

      if (!_auth["default"].verifyToken(token)) {
        res.status(401).json({
          status: 401,
          message: 'Not authorized'
        });
      } else {
        var payload = _auth["default"].verifyToken(token);

        var isAdmin = payload.isAdmin,
            type = payload.type;

        if (isAdmin !== true && type !== 'admin') {
          res.status(401).json({
            status: 401,
            message: 'Not authorized'
          });
        } else {
          next();
        }
      }
    }
  }]);

  return Validate;
}();

var _default = Validate;
exports["default"] = _default;