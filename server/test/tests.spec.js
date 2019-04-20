import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import {
  users, staffs, accounts, transactions,
} from '../postgresDB/DB/index';
import pool from '../postgresDB/DB/dbConnection';


chai.use(chaiHttp);

const { expect } = chai;
let userToken;

describe('Handle user signup to database', () => {
  it('should return status 201 if user is successfully added to database', async () => {
    try {
      await accounts.dropTable();
      await users.dropTable();
      await users.createUsersTable();
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'johnathan',
          lastname: 'Emmanuel',
          email: 'joe@gmail.com',
          password: '1234567890',
        })
        .end((err, res) => {
          userToken = res.body.data.token;
          expect(res).to.have.status(201);
          expect(res.body.status).to.equal(201);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Account created successfully');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('user');
          expect(res.body.data).to.have.property('token');
        });
    } catch (err) {
      throw err;
    }
  });
  it('should fail and return an error if email already exists in database with status 400', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'johnathan',
        lastname: 'Emmanuel',
        email: 'joe@gmail.com',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('A user with the given email already exists');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should fail if the email field is missing from the form with StatusCode: 403', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'johnathan',
        lastname: 'Emmanuel',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Email field is empty, missing or values not valid');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });
  it('should fail if firstname field is missing from the form, with StatusCode: 403', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastname: 'Emmanuel',
        password: '1234567890',
        email: 'joe@gmail.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('First name field is empty, missing or values not valid');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if lastname field is missing from the form, with StatusCode: 403', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Emmanuel',
        password: '1234567890',
        email: 'joe@gmail.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Last name field is empty, missing or values not valid');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should fail if password field is missing from the form, with StatusCode: 403', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        lastname: 'Emmanuel',
        firstname: 'John',
        email: 'joe@gmail.com',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Password field is empty, missing or values not valid');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message');
        done();
      });
  });
});

describe('Handle user(Client) login to database', () => {
  it('should pass and return a status of 200 if user details are in database',
    async () => {
      try {
        chai.request(app).post('/api/v1/auth/login').send({
          email: 'joe@gmail.com',
          password: '1234567890',
        }).end((err, res) => {
          userToken = res.body.data.token;
          expect(res).to.have.status(200);
        });
      } catch (err) {
        throw err;
      }
    });
  it('should fail and return error 400 if user details are incorrect',
    async () => {
      try {
        await pool.connect();
        chai.request(app).post('/api/v1/auth/login').send({
          email: 'joe@gmail.com',
          password: '1239495kt45',
        }).end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal(400);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('email or password incorrect');
        });
      } catch (err) {
        throw err;
      }
    });
  it('it should fail and return error 400 if user details are not found in database',
    async () => {
      try {
        chai.request(app).post('/api/v1/auth/login').send({
          email: 'taichi@gmail.com',
          password: '23ewdfdfd',
        }).end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal(400);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('User does not exists');
        });
      } catch (err) {
        throw err;
      }
    });
  it('should fail if all fields have not been filled', async () => {
    try {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          password: '1234567890',
        })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).to.be.a('string');
          expect(res.body.status).to.equal(403);
          expect(res.body.message).to.equal('Email field is empty, missing or values not valid');
        });
    } catch (err) {
      throw err;
    }
  });
});

describe('Handle user bank account creation', () => {
  it('should pass and return a response of 201, if account is successfully created', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        accType: 'current',
        userType: 'personal',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Bank account created successfully');
        done();
      });
  });
  it('should fail if user token is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .set('authorization', '12dsvcvfsfdfgdgdgdfada')
      .send({
        accType: 'current',
        userType: 'personal',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should fail if any field is missing', (done) => {
    chai.request(app)
      .post('/api/v1/accounts')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        accType: 'current',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });
});

describe('Handle Admin Login', () => {
  before('add admin to database', async () => {
    try {
      await staffs.dropTable();
      await staffs.createStaffsTable();
      await staffs.insert(
        'firstname, lastname, email, password, type',
        ['admin', 'admin', 'admin@gmail.com', '$2b$10$zrRfpRv1ntXO6h2h8wbC0.eWgLp0odJSaUYA5GEOd1XApg8AjWB.y', 'admin'],
      );
    } catch (err) {
      throw err;
    }
  });
  it('should pass and return a status of 200 if admin details are in database', (done) => {
    chai.request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'admin@gmail.com',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('it should fail and return error 400 if admin details are not found in database',
    (done) => {
      chai.request(app).post('/api/v1/auth/admin/login').send({
        email: 'taichi@gmail.com',
        password: '23ewdfdfdjhu',
      }).end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('User does not exists');
        done();
      });
    });
  it('it should fail and return error 403 if all fields are not filled or fields are missing',
    (done) => {
      chai.request(app).post('/api/v1/auth/admin/login').send({
        password: '23ewdfdfdjhu',
      }).end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.be.a('string');
        done();
      });
    });
});