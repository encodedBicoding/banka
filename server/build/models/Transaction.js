"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Database = _interopRequireDefault(require("./Database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var accounts = _Database["default"].accounts;

var Transaction =
/*#__PURE__*/
function () {
  function Transaction(user, accountNumber, amount) {
    _classCallCheck(this, Transaction);

    this.id = 0;
    this.createdOn = new Date(Date.now());
    this.type = '';
    this.accountNumber = accountNumber;
    this.cashier = user;
    this.amount = amount;
    this.oldBalance = 0;
    this.newBalance = 0;
  }

  _createClass(Transaction, [{
    key: "debitAccount",
    value: function debitAccount(accNumber) {
      var account = accounts.filter(function (acc) {
        return acc.accountNumber === accNumber;
      });
      this.id += 1;
      this.oldBalance = account[0].balance;
      this.type = 'debit';
      account[0].balance -= this.amount;
      this.newBalance = account[0].balance;
    }
  }, {
    key: "creditAccount",
    value: function creditAccount(accNumber) {
      var account = accounts.filter(function (acc) {
        return acc.accountNumber === accNumber;
      });
      this.id += 1;
      this.oldBalance = account[0].balance;
      this.type = 'credit';
      account[0].balance += this.amount;
      this.newBalance = account[0].balance;
    }
  }, {
    key: "printTransaction",
    value: function printTransaction() {
      return {
        TransactionId: this.id,
        createdOn: this.createdOn,
        transactionType: this.type,
        accountNumber: this.accountNumber,
        cashier: this.cashier.toLocaleUpperCase(),
        amount: this.amount,
        oldBalance: this.oldBalance,
        newBalance: this.newBalance
      };
    }
  }]);

  return Transaction;
}();

var _default = Transaction;
exports["default"] = _default;