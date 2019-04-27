"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_chai["default"].use(_chaiHttp["default"]);

var expect = _chai["default"].expect;
describe('Handle incoming requests', function () {
  it('should return status 200 and welcome message for / route', function (done) {
    _chai["default"].request(_app["default"]).get('/').end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Welcome to api version 1 of Banka');
      done(err);
    });
  });
  it('should return status 200 if route is /login', function (done) {
    _chai["default"].request(_app["default"]).get('/api/v1/login').end(function (err, res) {
      expect(res).to.have.status(200);
      done(err);
    });
  });
  it('should return status 404 if route is not available on server', function (done) {
    _chai["default"].request(_app["default"]).get('/i-dont-exist/').end(function (err, res) {
      expect(res).to.have.status(404);
      expect(res.body.message).to.equal('no such endpoints on this server');
      done();
    });
  });
});