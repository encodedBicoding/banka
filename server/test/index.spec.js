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
describe('Handle user login details', () => {
  it('it should fail and return error 404 if user details are not found in database', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'taichi@gmail.com',
        password: '23ewdfdfd',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('email or password not found');
        done();
      });
  });
  it('it should fail and return error 404 if staff details are not found in database', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/admin/login')
      .send({
        email: 'taichi@gmail.com',
        password: '23ewdfdfd',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('email or password not found');
        done();
      });
  });
});
// describe('Handle admin login', () => {
//   it('should return status 201 if cashier did not exist previously', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/2/create')
//       .send({
//         firstname: 'tommy',
//         email: 'tommy@gmail.com',
//         password: '1d22d343554',
//         type: 'staff',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         done();
//       });
//   });
//   it('should return status 201 if admin did not exist previously', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/2/create')
//       .send({
//         firstname: 'timber',
//         email: 'timmy@gmail.com',
//         password: '122d343554',
//         type: 'admin',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         done();
//       });
//   });
//   it('should fail and return status of 401 if admin already exist', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/2/create')
//       .send({
//         firstname: 'john',
//         email: 'johndoe@gmail.com',
//         password: '123456789',
//         type: 'admin',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         done();
//       });
//   });
//   it('should fail and return status 404 if admin doesnt exist in database', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/4/create')
//       .send({
//         firstname: 'john',
//         email: 'johndoe@gmail.com',
//         password: '123456789',
//         type: 'admin',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         done();
//       });
//   });
// });
// describe('Check if a user login details already exists before adding to database', () => {
//   it('should return status 401 and error message if user email is not found', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/auth/signup')
//       .send({
//         email: 'johndoe@gmail.com',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body.message).to.equal('A user with the given email already exists');
//         done();
//       });
//   });
//   it('should pass and return status 201 with confirmation messages', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/auth/signup')
//       .send({
//         firstname: 'test',
//         email: 'test@gmail.com',
//         password: '123456789',
//         lastname: 'tester',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         done();
//       });
//   });
//   it('should fail and return status 403 if all fields are not field', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/auth/signup')
//       .send({
//         firstname: 'seun',
//         email: ' ',
//         password: '122343554',
//         lastname: 'alakija',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(403);
//         done();
//       });
//   });
//   it('should fail and return status 403 if email is field wrongly', (done) => {
//     chai
//       .request(app)
//       .post('/api/v1/auth/signup')
//       .send({
//         firstname: 'seun',
//         email: ' dfdsaf',
//         password: '122343554',
//         lastname: 'alakija',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(403);
//         done();
//       });
//   });
// });
