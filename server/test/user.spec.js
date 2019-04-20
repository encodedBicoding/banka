import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { users } from '../postgresDB/DB/index';
import pool from '../postgresDB/DB/dbConnection';


chai.use(chaiHttp);

const { expect } = chai;

describe('Handle user signup to database', () => {
  it('should return status 201 if user is successfully added to database', async () => {
    try {
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
          expect(res).to.have.status(201);
          expect(res.body.status).to.equal(201);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('Account created successfully');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('user');
          expect(res.body.data).to.have.property('token');
        });
    } catch (err) {
      console.log(err);
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
  // it('it should fail and return error 404 if staff details are not found in database',
  //   (done) => {
  //     chai.request(app).post('/api/v1/auth/admin/login').send({
  //       email: 'taichi@gmail.com',
  //       password: '23ewdfdfd',
  //     }).end((err, res) => {
  //       expect(res).to.have.status(404);
  //       expect(res.body.message).to.equal('email or password not found');
  //       done();
  //     });
  //   });
});
