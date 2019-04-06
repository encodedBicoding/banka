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
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@gmail.com',
        password: '123456789',
        firstname: 'tester',
        lastname: 'test',
      })
      .end((err, res) => {
        userToken = res.body.data[1];
        done();
      });
  });
  it('should return status 200 if user account has been successfully created', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/accounts')
      .send({
        accType: 'current',
        userType: 'org',
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});
describe('Test user login', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        userToken = res.body.data[1];
        done();
      });
  });
  it('should return status 200 if user is a valid one', (done) => {
    chai
      .request(app)
      .get('/api/v1/2/accounts')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Testing admin account creation', () => {
  before((done) => {
   chai
       .request(app)
       .post('/api/v1/auth/admin/login')
       .send({
         email: 'johndoe@gmail.com',
         password: '123456789',
       })
       .end((err, res)=>{
         staffToken = res.body.data[1];
         done();
       })
  });
  it('should return status of 200 if account has been successfully activated or deactivated', (done) => {
    chai
        .request(app)
        .patch('/api/v1/2/account/2')
        .set('authorization', `Bearer ${staffToken}`)
        .end((err, res) => {
          expect(res).to.have.status((200));
          done();
        })
  })
})
