"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app"));

var _Database = _interopRequireDefault(require("../models/Database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var accounts = _Database["default"].accounts;

_chai["default"].use(_chaiHttp["default"]);

var expect = _chai["default"].expect;
var userToken;
var staffToken;
var cashierToken;
describe('Testing user account creation on route /api/v1/accounts', function () {
  before(function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      email: 'test@gmail.com',
      password: '123456789',
      firstName: 'tester',
      lastName: 'test'
    }).end(function (err, res) {
      userToken = res.body.data[1];
      done();
    });
  });
  it('should return status 201 if user account has been successfully created', function (done) {
    var id = accounts.length + 1;

    _chai["default"].request(_app["default"]).post('/api/v1/accounts').send({
      accType: 'current',
      userType: 'org'
    }).set('authorization', "Bearer ".concat(userToken)).end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.body.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body.data).to.be.an('object');
      expect(id).to.equal(2);
      done();
    });
  });
  it('should return status 401 if user already exists', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      email: 'test@gmail.com',
      password: '123456789',
      firstName: 'tester',
      lastName: 'test'
    }).end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.body.message).to.equal('A user with the given email already exists');
      done();
    });
  });
  it('should return status 403 if all user signup fields are not filled', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      email: 'test@gmail.com',
      password: '123456789',
      firstName: ' ',
      lastName: 'test'
    }).end(function (err, res) {
      expect(res).to.have.status(403);
      expect(res.body.message).to.equal('Please check that all fields are filled');
      done();
    });
  });
  it('should return status 403 if email field is invalid', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      email: 'testgmail.com',
      password: '123456789',
      firstName: 'test',
      lastName: 'test'
    }).end(function (err, res) {
      expect(res).to.have.status(403);
      expect(res.body.message).to.equal('Please check that all fields are filled');
      done();
    });
  });
  it('should fail and return status 401 if token supplied is invalid', function (done) {
    _chai["default"].request(_app["default"]).get('/api/v1/accounts').set('authorization', 'Bearer 53gfhry54ybfghrf').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.body.message).to.equal('Not Authorized');
      done();
    });
  });
  it('should fail and return status 401 if user is not in database', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/accounts').set('authorization', 'Bearer 934jdjfdjsij49').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.body.message).to.equal('Not Authorized');
      done();
    });
  });
});
describe('Test user login', function () {
  before(function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/login').send({
      email: 'test@gmail.com',
      password: '123456789'
    }).end(function (err, res) {
      userToken = res.body.data[1];
      done();
    });
  });
  it('should return status 200 if user is a valid one', function (done) {
    _chai["default"].request(_app["default"]).get('/api/v1/accounts').set('authorization', "Bearer ".concat(userToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status 200 if user image is a valid one', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/client/uploads').set('authorization', "Bearer ".concat(userToken)).field({
      user_img: "UI\\public\\uploads\\temp\\9134c30e9586bd2c2d9b2872060dba0b"
    }).attach('user_img', './UI/public/uploads/BANKA-IMG-2829.jpg').end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
describe('Testing admin account creation, account activation and deletion', function () {
  before(function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/admin/login').send({
      email: 'johndoe@gmail.com',
      password: '123456789'
    }).end(function (err, res) {
      staffToken = res.body.data[1];
      done();
    });
  });
  it('should fail and return status 401 if token supplied is invalid', function (done) {
    _chai["default"].request(_app["default"]).patch('/api/v1/accounts/2').set('authorization', 'Bearer 53gfhry54ybfghrf').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res.body.message).to.equal('Not authorized');
      done();
    });
  });
  it('should return status of 200 if account has been successfully activated or deactivated', function (done) {
    _chai["default"].request(_app["default"]).patch('/api/v1/accounts/2').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status of 404 no account was found to activate or deactivate', function (done) {
    _chai["default"].request(_app["default"]).patch('/api/v1/accounts/32').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      done();
    });
  });
  it('should set account to dormant if account was active', function (done) {
    var account = accounts.find(function (acc) {
      return acc.id === 2;
    });
    account.status = 'dormant';

    _chai["default"].request(_app["default"]).patch('/api/v1/accounts/2').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      expect(account.status).to.equal('active');
      done();
    });
  });
  it('should return status 200 if user account has been successfully deleted', function (done) {
    _chai["default"].request(_app["default"])["delete"]('/api/v1/accounts/2').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status 200 if user account has been successfully deleted', function (done) {
    _chai["default"].request(_app["default"])["delete"]('/api/v1/accounts/2').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status 201 if admin account has been successfully created', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/2/create').send({
      firstName: 'admin',
      email: 'admin@gmail.com',
      type: 'admin',
      password: '123456789'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.body.data).to.be.an('array');
      expect(res.body.status).to.equal(201);
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[1]).to.be.a('string');
      done();
    });
  });
  it('should return status 201 if staff account has been successfully created', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/2/create').send({
      firstName: 'staff',
      email: 'staff@gmail.com',
      type: 'staff',
      password: '123456789'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(201);
      expect(res.body.data).to.be.an('array');
      expect(res.body.status).to.equal(201);
      expect(res.body.data[0]).to.be.an('object');
      expect(res.body.data[1]).to.be.a('string');
      done();
    });
  });
  it('should return status 401 if admin account already exists', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/2/create').send({
      firstName: 'admin',
      email: 'admin@gmail.com',
      type: 'admin',
      password: '123456789'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(401);
      done();
    });
  });
  it('should return status 401 if staff account already exists', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/2/create').send({
      firstName: 'staff',
      email: 'staff@gmail.com',
      type: 'staff',
      password: '123456789'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(401);
      done();
    });
  });
  it('should return status 200 if admin image is a valid one', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/staff/2/uploads').set('authorization', "Bearer ".concat(staffToken)).field({
      user_img: "UI\\public\\uploads\\temp\\9134c30e9586bd2c2d9b2872060dba0b"
    }).attach('user_img', './UI/public/uploads/BANKA-IMG-2829.jpg').end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
});
describe('Testing staff ability to debit and credit an account', function () {
  var accID;
  before('staff login OK', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/admin/login').send({
      email: 'dominic@gmail.com',
      password: '123456789'
    }).end(function (err, res) {
      cashierToken = res.body.data[1];
      done();
    });
  });
  before('user should create an account', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/accounts').send({
      accType: 'current',
      userType: 'org'
    }).set('authorization', "Bearer ".concat(userToken)).end(function (err, res) {
      expect(res).to.have.status(201);
      accID = accounts[0].accountNumber;
      done();
    });
  });
  it('should return status 401 if account has insufficient funds', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/1/debit').send({
      amount: 300000000000000,
      accId: accID
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(401);
      done();
    });
  });
  it('should return status 404 if account ID is not found', function (done) {
    _chai["default"].request(_app["default"]).patch('/api/v1/transactions/3/debit').send({
      amount: 30000,
      accId: 34436877
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      done();
    });
  });
  it('should return status 404 if there is no account to credit', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/34/credit').send({
      amount: 30000,
      accId: 92039433
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.equal('Account ID not found');
      expect(res.body.status).to.equal(404);
      expect(res.body.status).to.be.a('number');
      done();
    });
  });
  it('should return status 404 if there is no account to credit', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/1/credit').send({
      amount: 30000,
      accId: 9203943345453
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.equal('Invalid account number');
      expect(res.body.status).to.equal(404);
      expect(res.body.status).to.be.a('number');
      done();
    });
  });
  it('should return status 200 if user account has been successfully credited', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/1/credit').send({
      amount: 40000,
      accId: accID
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status 200 if user account has been successfully debited', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/1/debit').send({
      amount: 30000,
      accId: accID
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should return status 404 if there is no account to debit', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/transactions/34/debit').send({
      amount: 30000,
      accId: 92039433
    }).set('authorization', "Bearer ".concat(cashierToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.equal('Account ID not found');
      expect(res.body.status).to.equal(404);
      expect(res.body.status).to.be.a('number');
      done();
    });
  });
  it('should return status 401 if user id is invalid', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/23/create').end(function (err, res) {
      expect(res).to.have.status(401);
      done();
    });
  });
});
describe('Handle user password reset', function () {
  before('should should have an account', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send({
      email: 'reset@gmail.com',
      password: '123456789',
      firstName: 'rester',
      lastName: 'reset'
    }).end(function (err, res) {
      userToken = res.body.data[1];
      done();
    });
  });
  it('should return status 200 if user old password matches the user current password', function (done) {
    _chai["default"].request(_app["default"]).put('/api/v1/client/password_reset').send({
      oldPassword: '123456789',
      newPassword: '987654321'
    }).set('authorization', "Bearer ".concat(userToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('password changed successfully');
      done();
    });
  });
  it('should return status 404 if user old password don\'t match the user current password', function (done) {
    _chai["default"].request(_app["default"]).put('/api/v1/client/password_reset').send({
      oldPassword: '12345eddv789',
      newPassword: '987654321'
    }).set('authorization', "Bearer ".concat(userToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('passwords do not match');
      done();
    });
  });
});
describe('Handle staff password reset', function () {
  before('should should be signed in', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/admin/login').send({
      email: 'dominic@gmail.com',
      password: '123456789'
    }).end(function (err, res) {
      staffToken = res.body.data[1];
      done();
    });
  });
  it('should return status 200 if user old password matches the user current password', function (done) {
    _chai["default"].request(_app["default"]).put('/api/v1/staff/password_reset').send({
      oldPassword: '123456789',
      newPassword: '987654321'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('password changed successfully');
      done();
    });
  });
  it('should return status 404 if user old password don\'t match the staff current password', function (done) {
    _chai["default"].request(_app["default"]).put('/api/v1/staff/password_reset').send({
      oldPassword: '12345eddv789',
      newPassword: '987654321'
    }).set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('passwords do not match');
      done();
    });
  });
});
describe('Handle staff ability to delete user account', function () {
  before('staff should log in', function (done) {
    _chai["default"].request(_app["default"]).post('/api/v1/auth/admin/login').send({
      email: 'johndoe@gmail.com',
      password: '123456789'
    }).end(function (err, res) {
      staffToken = res.body.data[1];
      done();
    });
  });
  it('should fail and return status 404 if there is no account to delete', function (done) {
    accounts.length = 0;

    _chai["default"].request(_app["default"])["delete"]('/api/v1/accounts/:accountId').set('authorization', "Bearer ".concat(staffToken)).end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.equal('No account to delete');
      expect(res.body.status).to.equal(404);
      expect(res.body.status).to.be.a('number');
      done();
    });
  });
});