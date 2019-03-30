const chai = require('chai'),
      app = require('../app'),
      chaiHttp = require('chai-http'),
      Accounts = require('../models/database').Accounts;
chai.use(chaiHttp);
const { expect } = chai;
describe('Testing user account creation on route /api/v1/:user_id/accounts', () => {
    it('should return status 200 if user account has been successfully debited', done => {
        chai.request(app).post("/api/v1/1/transactions/1/debit").send({
            amount: 30000,
            acc_id: 92039433
        }).end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    });
    it('should fail and return status 401 if account amount is less than amount-to-debit', done => {
        chai.request(app).post('/api/v1/1/transactions/1/debit').send({
            amount: 300000000,
            acc_id: 92039433
        }).end((err, res) => {
            expect(res).to.have.status(401);
            done(err);
        });
    });
    it('should fail and return status 401 and message if user_id not found', done => {
        chai.request(app).post('/api/v1/2/accounts').send({
            acc_type: 'current',
            user_type: 'org'
        }).end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('Not Authorized');
            done();
        });
    });
    it('should return status 200 and message if staff_id and account_id are available in database', done => {
        chai.request(app).patch('/api/v1/1/account/1').end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data.id).to.equal(1);
            done();
        });
    });
    it('should fail and return status 404 if no account is found for account_id in req.params.account_id', done => {
        chai.request(app).patch("/api/v1/1/account/23").end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal('No account found');
            done();
        });
    });
    it('should fail and return status 401 if no staff is found for staff_id in req.params.staff_id', done => {
        chai.request(app).patch("/api/v1/23/account/1").end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('Not Authorized');
            done();
        });
    });
    it('should fail and return status 401 with a Not Authorized message  if staff id is invalid', done => {
        chai.request(app).post("/api/v1/23/transactions/1/debit").send({
            amount: 3000,
            acc_id: 92039433
        }).end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.equal("Not Authorized");
            done();
        });
    });
    it('should fail and return status 404 with a Account ID not found message if acc id is invalid', done => {
        chai.request(app).post("/api/v1/1/transactions/23/debit").send({
            amount: 3000,
            acc_id: 92039433
        }).end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("Account ID not found");
            done();
        });
    });
    it('should return status 200 if user id is valid when trying to get all their accounts', done => {
        chai.request(app).get("/api/v1/1/accounts").end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    });
});
describe('Handle account status  account delete', ()=>{
    it('should return status 200 if Accounts array has been deleted successfully', done => {
        chai.request(app).delete('/api/v1/1/account/1').end((err, res) => {
            expect(res).to.have.status(200);
            done();
        });
    });
    it('should return status 404 if account is not found to delete', done => {
        chai.request(app).delete('/api/v1/1/account/23').end((err, res) => {
            expect(res).to.have.status(404);
            done();
        });
    });
    it('should return status 401 if user is not authorized to delete', done => {
        chai.request(app).delete('/api/v1/23/account/1').end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.equal( "Not Authorized");
            done();
        });
    });
    it('should return status 404 if Accounts array is empty', done => {
        chai.request(app).delete('/api/v1/1/account/1').end((err, res) => {
            expect(res).to.have.status(404);
            expect(Accounts.length).to.equal(0);
            expect(res.body.message).to.equal( "No account to delete");
            done();
        });
    });
});

