"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _generateAccountNumber = _interopRequireDefault(require("../helpers/generateAccountNumber"));

var _util = _interopRequireDefault(require("../helpers/util"));

var _dbConnection = _interopRequireDefault(require("../postgresDB/DB/dbConnection"));

var _createTables = require("../postgresDB/models/createTables");

var _index = require("../postgresDB/DB/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    value: async function createAccount(req, res) {
      var _req$body = req.body,
          accType = _req$body.accType,
          userType = _req$body.userType;
      var email = req.user.email;

      try {
        var user = await _index.users.findByEmail('*', [email]);
        var accountNumber = (0, _generateAccountNumber["default"])();
        await _dbConnection["default"].query(_createTables.accountTableQuery);
        var account = await _index.accounts.insert('accountnumber, owner, ownercategory, type', [accountNumber, user.id, userType, accType]);
        var noOfAccount = user.noofaccounts + 1;
        await _index.users.updateById("noofaccounts = ".concat(noOfAccount), [user.id]);
        res.status(201).json({
          status: 201,
          message: 'Bank account created successfully',
          data: account
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: "Error: ".concat(err.message)
        });
      }
    }
    /**
     * @description changes user account status
     * @param req express request object
     * @param res express response object
     * @returns {object} JSON
     */

  }, {
    key: "changeStatus",
    value: async function changeStatus(req, res) {
      var accountNumber = req.params.accountNumber;
      var updated;

      try {
        var account = await _index.accounts.findByAccountNumber('*', [accountNumber]);

        if (account.status === 'active') {
          updated = await _index.accounts.updateStatusById('dormant', "".concat(account.id));
          res.status(200).json({
            status: 200,
            message: "Account status changed to ".concat(updated.status),
            data: updated
          });
        } else {
          updated = await _index.accounts.updateStatusById('active', "".concat(account.id));
          res.status(200).json({
            status: 200,
            message: "Account status changed to ".concat(updated.status),
            data: updated
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: "Error: ".concat(err.message)
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
    value: async function deleteAccount(req, res) {
      var accountNumber = req.params.accountNumber;
      var email = req.user.email;

      try {
        var staff = await _index.staffs.findByEmail('firstname, lastname', [email]);
        var accountToDelete = await _index.accounts.findByAccountNumber('*', [accountNumber]);
        await _index.transactions.deleteByAccountNumber([accountToDelete.accountnumber]);
        await _index.accounts.deleteById([accountToDelete.id]);
        var user = await _index.users.findById('*', [accountToDelete.owner]);
        var subtractNoOfAccount = Number(user.noofaccounts) - 1;
        await _index.users.updateById("noofaccounts = '".concat(subtractNoOfAccount, "'"), [user.id]);
        res.status(200).json({
          status: 200,
          message: 'Account Successfully Deleted',
          deletedBy: "".concat(staff.firstname, " ").concat(staff.lastname)
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: "Error: ".concat(err.message)
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
    value: async function debitAccount(req, res) {
      var accountNumber = req.params.accountNumber;
      var _req$body2 = req.body,
          amount = _req$body2.amount,
          accountnumber = _req$body2.accountnumber;
      var email = req.user.email;

      try {
        var staff = await _index.staffs.findByEmail('*', [email]);
        var s = "".concat(staff.firstname, " ").concat(staff.lastname);
        var account = await _index.accounts.findByAccountNumber('*', [accountnumber]);

        if (account.balance >= amount) {
          var debit = {
            balance: account.balance - amount,
            date: new Date().toUTCString()
          };
          var updated = await _index.accounts.updateById("balance = '".concat(debit.balance, "', lastwithdrawal = '").concat(debit.date, "'"), [account.id]);
          await _index.transactions.createTransactionTable();
          var transaction = await _index.transactions.insert('accountnumber, type, cashier, amount, oldbalance, newbalance', [account.accountnumber, 'debit', s, amount, account.balance, updated.balance]);
          res.status(200).json({
            status: 200,
            message: 'Account debited successfully',
            data: transaction
          });
        } else if (Number(accountNumber) !== account.accountnumber) {
          res.status(400).json({
            status: 400,
            message: 'Specified account via URL doesn\'t exists'
          });
        } else {
          res.status(400).json({
            status: 400,
            message: 'Insufficient Funds'
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: 'Specified account number doesn\'t exists'
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
    value: async function creditAccount(req, res) {
      var accountNumber = req.params.accountNumber;
      var _req$body3 = req.body,
          amount = _req$body3.amount,
          accountnumber = _req$body3.accountnumber;
      var email = req.user.email;

      try {
        var staff = await _index.staffs.findByEmail('*', [email]);
        var s = "".concat(staff.firstname, " ").concat(staff.lastname);
        var account = await _index.accounts.findByAccountNumber('*', [accountnumber]);
        var bal = parseFloat(account.balance).toFixed(0);
        var credit = {
          balance: Number(bal) + Number(amount),
          date: new Date().toUTCString()
        };
        var updated = await _index.accounts.updateById("balance = '".concat(credit.balance, "', lastdeposit = '").concat(credit.date, "'"), [account.id]);
        await _index.transactions.createTransactionTable();
        var transaction = await _index.transactions.insert('accountnumber, type, cashier, amount, oldbalance, newbalance', [account.accountnumber, 'credit', s, amount, account.balance, updated.balance]);
        res.status(200).json({
          status: 200,
          message: 'Account credited successfully',
          data: transaction
        });

        if (Number(accountNumber) !== account.accountnumber) {
          res.status(400).json({
            status: 400,
            message: 'Specified account via URL doesn\'t exists'
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: "".concat(err.message)
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
    key: "getAllAccount",
    value: function getAllAccount(req, res) {
      var email = req.user.email;

      try {
        var user = _index.users.filter(function (client) {
          return client.email === email && client.type === 'client';
        });

        var acc = user[0].accounts;
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: acc
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: 'Error: credentials not in database'
        });
      }
    }
  }, {
    key: "getSingleAccountTransactions",
    value: function getSingleAccountTransactions(req, res) {
      var accountId = req.params.accountId;

      var account = _index.accounts.filter(function (acc) {
        return acc.accountNumber === Number(accountId);
      });

      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account number not found'
        });
      } else {
        var _transactions = account[0].transactions;
        res.status(200).json({
          status: 200,
          message: 'Transaction successful',
          data: _transactions
        });
      }
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(req, res) {
      var _req$body4 = req.body,
          newPassword = _req$body4.newPassword,
          oldPassword = _req$body4.oldPassword;
      var email = req.user.email;

      try {
        var user = _index.users.filter(function (u) {
          return u.email === email;
        });

        if (user.length <= 0) {
          var staff = _index.staffs.filter(function (s) {
            return s.email === email;
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
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: 'Error: credentials not in database'
        });
      }
    }
  }]);

  return Accounts;
}();

var _default = Accounts;
exports["default"] = _default;