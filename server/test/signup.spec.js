import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { users } from '../postgresDB/DB/index';


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
