import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;
let userToken;
let staffToken;
let cashierToken;
let userID;

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
        userID = res.body.data[0].id;
        done();
      });
  });
  it('should return status 200 if user account has been successfully created', (done) => {
    chai
      .request(app)
      .post(`/api/v1/${userID}/accounts`)
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
  it('should return status 401 if user already exists', (done) => {
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
        firstname: ' ',
        lastname: 'test',
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
        firstname: 'test',
        lastname: 'test',
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
      .get('/api/v1/2/accounts')
      .set('authorization', 'Bearer 53gfhry54ybfghrf')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Not authorized');
        done();
      });
  });
  it('should fail and return status 401 if user is not in database', (done) => {
    chai
      .request(app)
      .post('/api/v1/32/accounts')
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
  it('should return status 200 if user image is a valid one', (done) => {
    chai
      .request(app)
      .post('/api/v1/client/2/uploads')
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
        staffToken = res.body.data[1];
        done();
      });
  });
  it('should fail and return status 401 if token supplied is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/2/account/2')
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
      .patch('/api/v1/2/account/2')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status((200));
        done();
      });
  });
  it('should return status 200 if user account has been successfully deleted', (done) => {
    chai
      .request(app)
      .delete('/api/v1/2/account/2')
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
        firstname: 'admin',
        email: 'admin@gmail.com',
        type: 'admin',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it('should return status 201 if staff account has been successfully created', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstname: 'staff',
        email: 'staff@gmail.com',
        type: 'staff',
        password: '123456789',
      })
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it('should return status 401 if admin account already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/2/create')
      .send({
        firstname: 'admin',
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
        firstname: 'staff',
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
  before('staff login OK', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'dominic@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        cashierToken = res.body.data[1];
        done();
      });
  });

  it('should return status 404 if account ID is not found', (done) => {
    chai
      .request(app)
      .patch('/api/v1/1/transactions/3/debit')
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
  it('should return status 401 if account has insufficient funds', (done) => {
    chai
      .request(app)
      .post('/api/v1/1/transactions/1/debit')
      .send({
        amount: 300000000000000,
        accId: 92039433,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should return status 200 if user account has been successfully credited', (done) => {
    chai
      .request(app)
      .post('/api/v1/1/transactions/1/credit')
      .send({
        amount: 30000,
        accId: 92039433,
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
      .post('/api/v1/1/transactions/1/debit')
      .send({
        amount: 30000,
        accId: 92039433,
      })
      .set('authorization', `Bearer ${cashierToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
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
