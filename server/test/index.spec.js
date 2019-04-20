import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;
describe('Handle incoming requests', () => {
  it('should return status 200 and welcome message for / route', (done) => {
    chai.request(app).get('/').end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Welcome to api version 1 of Banka');
      done(err);
    });
  });
  it('should return status 200 if route is /login', (done) => {
    chai.request(app).get('/api/v1/login').end((err, res) => {
      expect(res).to.have.status(200);
      done(err);
    });
  });
  it('should return status 404 if route is not available on server', (done) => {
    chai
      .request(app)
      .get('/i-dont-exist/')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('no such endpoints on this server');
        done();
      });
  });
});
