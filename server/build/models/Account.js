"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Account = function Account(id, accountNumber, type, userType, fn, ln, email, ob) {
  _classCallCheck(this, Account);

  this.id = id;
  this.accountNumber = accountNumber;
  this.firstName = fn;
  this.lastName = ln;
  this.email = email;
  this.owner = '';
  this.type = type;
  this.openingBalance = ob === undefined ? 0.0 : ob;
  this.ownerCategory = userType;
  this.createdOn = new Date(Date.now());
  this.status = 'active';
  this.balance = 0.0;
  this.lastWithdrawal = 'no transactions yet';
  this.lastDeposit = 'no transactions yet';
};

var _default = Account;
exports["default"] = _default;