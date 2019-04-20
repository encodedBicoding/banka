import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import pool from '../postgresDB/DB/dbConnection';


chai.use(chaiHttp);

const { expect } = chai;

describe('Handle user(Client) login to database', () => {
  it('should pass and return a status of 200 if user details are in database',
    async () => {
      try {
        await pool.connect();
        chai.request(app).post('/api/v1/auth/login').send({
          email: 'joe@gmail.com',
          password: '1234567890',
        }).end((err, res) => {
          expect(res).to.have.status(200);
        });
      } catch (err) {
        console.log(err);
      }
    });
  it('it should fail and return error 400 if user details are incorrect',
    async () => {
      try {
        await pool.connect();
        chai.request(app).post('/api/v1/auth/login').send({
          email: 'joe@gmail.com',
          password: '123456789',
        }).end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.equal(400);
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal('email or password incorrect');
        });
      } catch (err) {
        console.log(err);
      }
    });
  it('it should fail and return error 400 if user details are not found in database',
    async () => {
      try {
        await pool.connect();
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
        console.log(err);
      }
    });
  it('should fail if all fields have not been filled', async () => {
    try {
      await pool.connect();
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
      console.log(err);
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
