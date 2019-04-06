import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Database from '../models/Database';

const { accounts } = Database;

chai.use(chaiHttp);

const { expect } = chai;
let userToken;
let staffToken;

describe('Testing user account creation on route /api/v1/:userId/accounts', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'johndoe@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        userToken = res.body.data[0].token;
        done();
      });
  });
  it('should return status 200 if user account has been successfully created', (done) => {
    chai.request(app).post('/api/v1/1/accounts').send({
      accType: 'current',
      userType: 'org',
    }).end((err, res) => {
      expect(res).to.have.status(201);
      done();
    });
  });
});
