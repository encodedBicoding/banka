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
let adminToken;
let staffToken;
let accNumber;

describe('Handle user signup to database', () => {
  it('should return status 201 if user is successfully added to database', async () => {
    try {
      await transactions.dropTable();
      await accounts.dropTable();
      await users.dropTable();
      await users.createUsersTable();
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'J o                          hnathan',
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
        expect(res.body).to.be.an('object');
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
    (done) => {
      chai.request(app).post('/api/v1/auth/login').send({
        email: 'joe@gmail.com',
        password: '1234567890',
      }).end((err, res) => {
        userToken = res.body.data.token;
        expect(res).to.have.status(200);
        done();
      });
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
    (done) => {
      chai.request(app).post('/api/v1/auth/login').send({
        email: 'taichi@gmail.com',
        password: '23ewdfdfd',
      }).end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('User does not exists');
        done();
      });
    });
  it('should fail if all fields have not been filled', (done) => {
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
        done();
      });
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
        accNumber = res.body.data.accountnumber;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Bank account created successfully');
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
      expect(err.status).to.be.an('integer');
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
        adminToken = res.body.data.token;
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
  it('should allow Admin to successfully deactivate a user account', (done) => {
    chai.request(app)
      .patch(`/api/v1/accounts/${accNumber}`)
      .set('authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should fail if admin token is invalid with a 401 status code', (done) => {
    chai.request(app)
      .patch(`/api/v1/accounts/${accNumber}`)
      .set('authorization', 'Bearer fjnjnjidjsf0wjkdsjdnj')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
describe('Handle admin ability to create a staff', () => {
  it('should pass and return status 201 if staff/cashier account has been created', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        firstname: 'Dominic',
        lastname: 'Staff',
        email: 'dominicstaff@gmail.com',
        type: 'staff',
        password: '1234567890',
      })
      .end((err, res) => {
        staffToken = res.body.data.token;
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should pass and return status 201 if Admin account has been created', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        firstname: 'Dominic',
        lastname: 'Admin',
        email: 'dominicadmin@gmail.com',
        type: 'admin',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 401 if admin token is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create')
      .set('authorization', 'm,kdsmmnnjdfnjg')
      .send({
        firstname: 'Dominic',
        lastname: 'Admin',
        email: 'dominicadmin@gmail.com',
        type: 'admin',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 403 if all fields are not filled', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        firstname: 'Dominic',
        lastname: 'Admin',
        email: 'dominicadmin@gmail.com',
        type: 'admin',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 if no token was supplied', (done) => {
    chai.request(app)
      .post('/api/v1/admin/create')
      .send({
        firstname: 'Dominic',
        lastname: 'Admin',
        email: 'dominicadmin@gmail.com',
        type: 'admin',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
});
describe('Handle Staff Login', () => {
  it('should pass and return a status of 200 if staff details are in database', (done) => {
    chai.request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'dominicstaff@gmail.com',
        password: '1234567890',
      })
      .end((err, res) => {
        staffToken = res.body.data.token;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should pass and return a status of 200 if admin details are in database', (done) => {
    chai.request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'dominicadmin@gmail.com',
        password: '1234567890',
      })
      .end((err, res) => {
        adminToken = res.body.data.token;
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
  it('should allow Staff to successfully deactivate a user account', (done) => {
    chai.request(app)
      .patch(`/api/v1/accounts/${accNumber}`)
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should fail if staff token is invalid with a 401 status code', (done) => {
    chai.request(app)
      .patch(`/api/v1/accounts/${accNumber}`)
      .set('authorization', 'Bearer fjnjnjidjsf0wjkdsjdnj')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});

describe('Handle staff and admin ability to view all user account', () => {
  it('should pass and return status 200 if account is gotten successfully', (done) => {
    chai.request(app)
      .get('/api/v1/user/joe@gmail.com/accounts')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
});
describe('Handle staff/admin ability to get a specific user account', () => {
  it('should pass and return status 200 if account was gotten successfully', (done) => {
    chai.request(app)
      .get(`/api/v1/accounts/${accNumber}`)
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 if account number doesn\'t exists', (done) => {
    chai.request(app)
      .get('/api/v1/accounts/484454')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 401 if staff token is invalid', (done) => {
    chai.request(app)
      .get(`/api/v1/accounts/${accNumber}`)
      .set('authorization', 'Bearer 3939339339309')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
});
describe('Handle staff/admin ability to view all accounts ', () => {
  it('should pass and return status 200 if it was successful and there is a data to return', (done) => {
    chai.request(app)
      .get('/api/v1/accounts')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should fail and return status 401 if the staff token is wrong', (done) => {
    chai.request(app)
      .get('/api/v1/accounts')
      .set('authorization', 'Bearer mnjnuokokooko')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
describe('Handle staff/admin ability to view all active accounts accounts ', () => {
  it('should pass and return status 200 if it was successful and there is a data to return', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=active')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 no account was found for a status', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=dormant')
      .set('authorization', `Bearer ${staffToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 401 if the staff token is wrong', (done) => {
    chai.request(app)
      .get('/api/v1/accounts?status=active')
      .set('authorization', 'Bearer mnjnuokokooko')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
describe('Handle staff ability to debit a user account', () => {
  before('drop any transaction tables, add money to account', async () => {
    await transactions.dropTable();
    const amount = 500000;
    await accounts.updateById(`balance = '${amount}'`, [1]);
  });
  it('should pass and return status 200 if account has been successfully debited', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/debit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: 2000,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
  it('should fail and return status 403 if all fields are not filled', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/debit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({

      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 if account number doesn\'t exists', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/99484895/debit')
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: 2000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 if account balance is less than amount to debit', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/debit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: 34324323534534000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });

  it('should fail and return status 401 if staff token is wrong', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/debit`)
      .set('authorization', 'Bearer 99jijdsij8j99ds')
      .send({
        amount: 34324323534534000,
        accountnumber: `${accNumber}`,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
});

describe('Handle staff ability to credit user account', () => {
  it('should pass and return status 200 if account has been successfully credited', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/credit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: 2000.89,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
  it('should fail and return status 400 if amount is less than or equal to zero', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/credit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: -2000.89,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 403 if all fields are not filled', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/credit`)
      .set('authorization', `Bearer ${staffToken}`)
      .send({

      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 400 if account number doesn\'t exists', (done) => {
    chai.request(app)
      .post('/api/v1/transactions/27383238932/credit')
      .set('authorization', `Bearer ${staffToken}`)
      .send({
        amount: 2000,
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
  it('should fail and return status 401 if staff token is wrong', (done) => {
    chai.request(app)
      .post(`/api/v1/transactions/${accNumber}/credit`)
      .set('authorization', 'Bearer 99jijdsij8j99ds')
      .send({
        amount: 34324323534534000,
        accountnumber: `${accNumber}`,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.a('string');
        done();
      });
  });
});
describe('Handle user ability to view transaction on a single account', () => {
  it('should pass and return status 200 if account number is valid', (done) => {
    chai.request(app)
      .get(`/api/v1/accounts/${accNumber}/transactions`)
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('array');
      });
    done();
  });
  it('should fail and return status 400 user token is not provided', (done) => {
    chai.request(app)
      .get(`/api/v1/accounts/${accNumber}/transactions`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.be.a('string');
      });
    done();
  });
  it('should pass and return status 401 user token is invalid', (done) => {
    chai.request(app)
      .get(`/api/v1/accounts/${accNumber}/transactions`)
      .set('authorization', 'Bearer mkskdfjisfsofds')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.be.a('string');
      });
    done();
  });
});
// describe('Handle user ability to view transaction by id', () => {
//   it('should pass and return status 200 if it is successful', (done) => {
//     chai.request(app)
//       .get('/api/v1/transactions/1')
//       .set('authorization', `Bearer ${userToken}`)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         done();
//       });
//   });
//   it('should fail and return status 400 if transactionID is not found in the database', (done) => {
//     chai.request(app)
//       .get('/api/v1/transactions/90')
//       .set('authorization', `Bearer ${userToken}`)
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         done();
//       });
//   });
//   it('should fail and return status 401 user token is invalid', (done) => {
//     chai.request(app)
//       .get('/api/v1/transactions/1')
//       .set('authorization', 'Bearer ksjdjnjnjdnjsndsji')
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         done();
//       });
//   });
// });
// describe('Handle user account deleting by staff or admin', () => {
//   after('drop all tables', async () => {
//     await transactions.dropTable();
//     await accounts.dropTable();
//     await users.dropTable();
//     await staffs.dropTable();
//   });
//   it('should pass and return 200 if staff token is valid', (done) => {
//     chai.request(app)
//       .delete(`/api/v1/accounts/${accNumber}`)
//       .set('authorization', `Bearer ${staffToken}`)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.message).to.be.a('string');
//         expect(res.body.status).to.equal(200);
//         expect(res.body.message).to.equal('Account Successfully Deleted');
//         done();
//       });
//   });
//   it('should fail and return 401 if staff token is invalid', (done) => {
//     chai.request(app)
//       .delete(`/api/v1/accounts/${accNumber}`)
//       .set('authorization', 'Bearer uuhu88dhdh8sdufjhfuhsuh8')
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.be.a('string');
//         expect(res.body.status).to.equal(401);
//         expect(res.body.message).to.be.a('string');
//         done();
//       });
//   });
//   it(
//     'should fail and return status 404 if no account has been registered in the database',
//     (done) => {
//       chai.request(app).get('/api/v1/accounts')
//         .set('authorization', `Bearer ${staffToken}`)
//         .end((err, res) => {
//           expect(res).to.have.status(404);
//           expect(res.body.status).to.equal(404);
//           expect(res.body.message).to.be.a('string');
//           done();
//         });
//     },
//   );
// });
