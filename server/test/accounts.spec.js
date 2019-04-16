import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Database from '../models/Database';

const { accounts } = Database;


chai.use(chaiHttp);

const { expect } = chai;
let userToken;
let staffToken;
let cashierToken;

describe('Testing user account creation on route /api/v1/accounts', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@gmail.com',
        password: '123456789',
        firstName: 'tester',
        lastName: 'test',
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });
  it('should return status 201 if user account has been successfully created', (done) => {
    const id = accounts.length + 1;
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        accType: 'current',
        userType: 'org',
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('object');
        expect(id).to.equal(2);
        done();
      });
  });
  it('should return status 401 if user already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@gmail.com',
        password: '123456789',
        firstName: 'tester',
        lastName: 'test',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('A user with the given email already exists');
        done();
      });
  });
  it('should return status 403 if all user signup fields are not filled', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@gmail.com',
        password: '123456789',
        firstName: ' ',
        lastName: 'test',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Please check that all fields are filled');
        done();
      });
  });
  it('should return status 403 if email field is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'testgmail.com',
        password: '123456789',
        firstName: 'test',
        lastName: 'test',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('Please check that all fields are filled');
        done();
      });
  });
  it('should fail and return status 401 if token supplied is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/accounts')
      .set('authorization', 'Bearer 53gfhry54ybfghrf')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Not Authorized');
        done();
      });
  });
  it('should fail and return status 401 if user is not in database', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .set('authorization', 'Bearer 934jdjfdjsij49')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Not Authorized');
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
        userToken = res.body.data.token;
        done();
      });
  });
  it('should return status 200 if user is a valid one', (done) => {
    chai
      .request(app)
      .get('/api/v1/accounts')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return status 200 if user image is a valid one', (done) => {
    chai
      .request(app)
      .post('/api/v1/client/uploads')
      .set('authorization', `Bearer ${userToken}`)
      .field({ user_img: 'UI\\public\\uploads\\temp\\9134c30e9586bd2c2d9b2872060dba0b' })
      .attach('user_img', './UI/public/uploads/BANKA-IMG-2829.jpg')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Testing admin account creation, account activation and deletion', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'johndoe@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });
  it('should fail and return status 401 if token supplied is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/2')
      .set('authorization', 'Bearer 53gfhry54ybfghrf')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Not authorized');
        done();
      });
  });
  it('should return status of 200 if account has been successfully activated or deactivated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/2')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status((200));
        done();
      });
  });
  it('should return status of 404 no account was found to activate or deactivate', (done) => {
    chai
      .request(app)
      .patch('/api/v1/accounts/32')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status((404));
        done();
      });
  });
  it('should set account to dormant if account was active', (done) => {
    const account = accounts.find(acc => acc.id === 2);
    account.status = 'dormant';
    chai
      .request(app)
      .patch('/api/v1/accounts/2')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status((200));
        expect(account.status).to.equal('active');
        done();
      });
  });
  it('should return status 200 if user account has been successfully deleted', (done) => {
    chai
      .request(app)
      .delete('/api/v1/accounts/2')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return status 200 if user account has been successfully deleted', (done) => {
    chai
      .request(app)
      .delete('/api/v1/accounts/2')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return status 201 if admin account has been successfully created', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstName: 'admin',
        email: 'admin@gmail.com',
        type: 'admin',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.status).to.equal(201);
        done();
      });
  });
  it('should return status 201 if staff account has been successfully created', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstName: 'staff',
        email: 'staff@gmail.com',
        type: 'staff',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.status).to.equal(201);

        done();
      });
  });
  it('should return status 401 if admin account already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstName: 'admin',
        email: 'admin@gmail.com',
        type: 'admin',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should return status 401 if staff account already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstName: 'staff',
        email: 'staff@gmail.com',
        type: 'staff',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should return status 200 if admin image is a valid one', (done) => {
    chai
      .request(app)
      .post('/api/v1/staff/2/uploads')
      .set('authorization', `Bearer ${staffToken}`)
      .field({ user_img: 'UI\\public\\uploads\\temp\\9134c30e9586bd2c2d9b2872060dba0b' })
      .attach('user_img', './UI/public/uploads/BANKA-IMG-2829.jpg')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
describe('Testing staff ability to debit and credit an account', () => {
  let accID;
  before('staff login OK', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'dominic@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        cashierToken = res.body.data.token;
        done();
      });
  });
  before('user should create an account', (done) => {
    chai
      .request(app)
      .post('/api/v1/accounts')
      .send({
        accType: 'current',
        userType: 'org',
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        accID = accounts[0].accountNumber;
        done();
      });
  });
  it('should return status 401 if account has insufficient funds', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/1/debit')
      .send({
        amount: 300000000000000,
        accId: accID,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should return status 404 if account ID is not found', (done) => {
    chai
      .request(app)
      .patch('/api/v1/transactions/3/debit')
      .send({
        amount: 30000,
        accId: 34436877,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('should return status 404 if there is no account to credit', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/34/credit')
      .send({
        amount: 30000,
        accId: 92039433,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Account ID not found');
        expect(res.body.status).to.equal(404);
        expect(res.body.status).to.be.a('number');
        done();
      });
  });
  it('should return status 404 if there is no account to credit', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/1/credit')
      .send({
        amount: 30000,
        accId: 9203943345453,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Invalid account number');
        expect(res.body.status).to.equal(404);
        expect(res.body.status).to.be.a('number');
        done();
      });
  });
  it('should return status 200 if user account has been successfully credited', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/1/credit')
      .send({
        amount: 40000,
        accId: accID,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return status 200 if user account has been successfully debited', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/1/debit')
      .send({
        amount: 397.89,
        accId: accID,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return status 404 if there is no account to debit', (done) => {
    chai
      .request(app)
      .post('/api/v1/transactions/34/debit')
      .send({
        amount: 30000,
        accId: 92039433,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Account ID not found');
        expect(res.body.status).to.equal(404);
        expect(res.body.status).to.be.a('number');
        done();
      });
  });
  it('should return status 401 if user id is invalid', (done) => {
    chai
      .request(app)
      .post('/api/v1/23/create')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
describe('Handle user password reset', () => {
  before('should should have an account', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'reset@gmail.com',
        password: '123456789',
        firstName: 'rester',
        lastName: 'reset',
      })
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });
  it('should return status 200 if user old password matches the user current password', (done) => {
    chai
      .request(app)
      .put('/api/v1/client/password_reset')
      .send({
        oldPassword: '123456789',
        newPassword: '987654321',
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('password changed successfully');
        done();
      });
  });
  it('should return status 404 if user old password don\'t match the user current password', (done) => {
    chai
      .request(app)
      .put('/api/v1/client/password_reset')
      .send({
        oldPassword: '12345eddv789',
        newPassword: '987654321',
      })
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('passwords do not match');
        done();
      });
  });
});
describe('Handle staff password reset', () => {
  before('should should be signed in', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'dominic@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });
  it('should return status 200 if user old password matches the user current password', (done) => {
    chai
      .request(app)
      .put('/api/v1/staff/password_reset')
      .send({
        oldPassword: '123456789',
        newPassword: '987654321',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('password changed successfully');
        done();
      });
  });
  it('should return status 404 if user old password don\'t match the staff current password', (done) => {
    chai
      .request(app)
      .put('/api/v1/staff/password_reset')
      .send({
        oldPassword: '12345eddv789',
        newPassword: '987654321',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('passwords do not match');
        done();
      });
  });
});
describe('Handle staff ability to delete user account', () => {
  before('staff should log in', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'johndoe@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });
  it('should fail and return status 404 if there is no account to delete', (done) => {
    accounts.length = 0;
    chai
      .request(app)
      .delete('/api/v1/accounts/:accountId')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('No account to delete');
        expect(res.body.status).to.equal(404);
        expect(res.body.status).to.be.a('number');
        done();
      });
  });
});
