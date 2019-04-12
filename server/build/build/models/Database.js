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

var DummyData = function DummyData() {
  _classCallCheck(this, DummyData);

  this.users = [{
    id: 1,
    firstName: 'john',
    lastName: 'doe',
    username: 'jonny',
    email: 'johndoe@gmail.com',
    password: '$2b$10$rgZSWmHmx51L/VYEU10TcOKYVhLdFBI.yVkbxWoNz529r1WbxPoAK',
    imageUrl: '',
    type: 'client',
    isAdmin: false,
    noOfAccounts: 1,
    accounts: [{
      id: 1,
      accountNumber: 92039433,
      createdOn: new Date(Date.now()),
      type: 'savings',
      owner: 1,
      status: 'active',
      balance: 100000.00,
      lastWithdrawal: new Date(Date.now()),
      lastDeposit: new Date(Date.now()),
      ownerCategory: 'personal'
    }]
  }];
  this.accounts = [{
    id: 1,
    accountNumber: 92039433,
    createdOn: new Date(Date.now()),
    type: 'savings',
    owner: 1,
    status: 'active',
    balance: 100000.00,
    lastWithdrawal: new Date(Date.now()),
    lastDeposit: new Date(Date.now()),
    ownerCategory: 'personal'
  }];
  this.staffs = [{
    id: 1,
    firstName: 'dominic',
    lastName: 'isioma',
    email: 'dominic@gmail.com',
    password: '$2b$10$rgZSWmHmx51L/VYEU10TcOKYVhLdFBI.yVkbxWoNz529r1WbxPoAK',
    imageUrl: '',
    type: 'staff',
    isAdmin: true
  }, {
    id: 2,
    firstName: 'john',
    lastName: 'doe',
    email: 'johndoe@gmail.com',
    password: '$2b$10$rgZSWmHmx51L/VYEU10TcOKYVhLdFBI.yVkbxWoNz529r1WbxPoAK',
    imageUrl: '',
    type: 'admin',
    isAdmin: true
  }];
};

var Database = new DummyData();
var _default = Database;
exports["default"] = _default;