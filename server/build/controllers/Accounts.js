"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Database = _interopRequireDefault(require("../models/Database"));

var _generateAccountNumber = _interopRequireDefault(require("../helpers/generateAccountNumber"));

var _Transaction = _interopRequireDefault(require("../models/Transaction"));

var _Account = _interopRequireDefault(require("../models/Account"));

var _auth = _interopRequireDefault(require("../helpers/auth"));

var _util = _interopRequireDefault(require("../helpers/util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var users = _Database["default"].users,
    accounts = _Database["default"].accounts,
    staffs = _Database["default"].staffs;
/**
 * @class Accounts
 */

var Accounts =
/*#__PURE__*/
function () {
  function Accounts() {
    _classCallCheck(this, Accounts);
  }

  _createClass(Accounts, null, [{
    key: "createAccount",

    /**
     * @description creates a user banka account
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */
    value: function createAccount(req, res) {
      var _req$body = req.body,
          accType = _req$body.accType,
          userType = _req$body.userType;
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var user = users.filter(function (u) {
        return u.email === payload.email;
      });
      var accountNumber = (0, _generateAccountNumber["default"])();
      var id = accounts.length + 1;
      var account = new _Account["default"](id, accountNumber, accType, userType, user[0].firstName, user[0].lastName, user[0].email);
      account.owner = user[0].id;
      user[0].accounts.push(account);
      user[0].noOfAccounts += 1;
      accounts.push(account);
      res.status(201).json({
        status: 201,
        data: account
      });
    }
    /**
     * @description changes user account status
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "changeStatus",
    value: function changeStatus(req, res) {
      var accountId = req.params.accountId;
      var account = accounts.filter(function (acc) {
        return acc.id === Number(accountId);
      });

      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'No account found'
        });
      } else {
        if (account[0].status === 'active') {
          account[0].status = 'dormant';
        } else {
          account[0].status = 'active';
        }

        res.status(200).json({
          status: 200,
          data: account
        });
      }
    }
    /**
     * @description deletes a user account
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "deleteAccount",
    value: function deleteAccount(req, res) {
      var accountId = req.params.accountId;
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var staff = staffs.filter(function (s) {
        return s.email === payload.email && s.isAdmin === true;
      });

      if (accounts.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'No account to delete'
        });
      } else {
        accounts.splice(accounts.findIndex(function (account) {
          return account.id === Number(accountId);
        }));
        res.status(200).json({
          status: 200,
          message: 'Account Successfully Deleted',
          deletedBy: "".concat(staff[0].firstName, " ").concat(staff[0].lastName)
        });
      }
    }
    /**
     * @description debits a user account
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "debitAccount",
    value: function debitAccount(req, res) {
      var accountId = req.params.accountId;
      var _req$body2 = req.body,
          amount = _req$body2.amount,
          accId = _req$body2.accId;
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var staff = staffs.filter(function (s) {
        return s.email === payload.email && s.type === 'staff';
      });
      var s = "".concat(staff[0].firstName, " ").concat(staff[0].lastName);
      var account = accounts.filter(function (acc) {
        return acc.id === Number(accountId);
      });

      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account ID not found'
        });
      } else if (account[0].id === Number(accountId) && account[0].accountNumber === Number(accId) && account[0].balance >= amount) {
        var transaction = new _Transaction["default"](s, account[0].accountNumber, amount);
        transaction.debitAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: transaction.printTransaction()
        });
      } else {
        res.status(401).json({
          status: 401,
          message: 'Insufficient Funds'
        });
      }
    }
    /**
     * @description credits a user account
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "creditAccount",
    value: function creditAccount(req, res) {
      var accountId = req.params.accountId;
      var _req$body3 = req.body,
          amount = _req$body3.amount,
          accId = _req$body3.accId;
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var staff = staffs.filter(function (s) {
        return s.email === payload.email && s.type === 'staff';
      });
      var s = "".concat(staff[0].firstName, " ").concat(staff[0].lastName);
      var account = accounts.filter(function (acc) {
        return acc.id === Number(accountId);
      });

      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account ID not found'
        });
      } else if (account[0].id === Number(accountId) && account[0].accountNumber === Number(accId)) {
        var transaction = new _Transaction["default"](s, account[0].accountNumber, Number(amount));
        transaction.creditAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: transaction.printTransaction()
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Invalid account number'
        });
      }
    }
    /**
     * @description returns a user account
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "getSingleAccount",
    value: function getSingleAccount(req, res) {
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var user = users.filter(function (client) {
        return client.email === payload.email && client.type === 'client';
      });
      var acc = user[0].accounts;
      res.status(200).json({
        status: 200,
        data: acc
      });
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(req, res) {
      var _req$body4 = req.body,
          newPassword = _req$body4.newPassword,
          oldPassword = _req$body4.oldPassword;
      var token = req.headers.authorization.split(' ')[1];

      var payload = _auth["default"].verifyToken(token);

      var user = users.filter(function (u) {
        return u.email === payload.email;
      });

      if (user.length <= 0) {
        var staff = staffs.filter(function (s) {
          return s.email === payload.email;
        });

        if (_util["default"].validatePassword(oldPassword, staff[0].password)) {
          staff[0].password = _util["default"].hashPassword(newPassword);
          res.status(200).json({
            status: 200,
            message: 'password changed successfully'
          });
        } else {
          res.status(404).json({
            status: 404,
            message: 'passwords do not match'
          });
        }
      } else if (user.length > 0) {
        if (_util["default"].validatePassword(oldPassword, user[0].password)) {
          user[0].password = _util["default"].hashPassword(newPassword);
          res.status(200).json({
            status: 200,
            message: 'password changed successfully'
          });
        } else {
          res.status(404).json({
            status: 404,
            message: 'passwords do not match'
          });
        }
      }
    }
  }]);

  return Accounts;
}();

var _default = Accounts;
exports["default"] = _default;