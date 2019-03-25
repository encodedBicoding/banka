const chai = require('chai'),
      app = require('../app'),
      chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
describe('Testing user account creation on route /api/v1/:userid/accounts', ()=>{
    it('should return status 200 and owner id if userid is found', (done)=>{
        chai
            .request(app)
            .post('/accounts')
            .send({
                acc_type: 'current',
                user_type: 'org'
            })
            .end((err, res)=>{
                expect(res).to.have.status(201);
                expect(res.body.data.owner).to.equal(1);
                done(err);
            })

    });
    it('should fail and return status 401 and message if userid not found', (done)=>{
        chai
            .request(app)
            .post('/2/accounts')
            .send({
                acc_type: 'current',
                user_type: 'org'
            })
            .end((err, res)=>{
                expect(res).to.have.status(401);
                expect(res.body.message).to.equal('Not Authorized');
                done(err);
            })
    });
    it('should return status 200 and message if staff_id and account_id are available in database', (done)=>{
        chai
            .request(app)
            .patch('/1/account/1')
            .end((err, res)=>{
                expect(res).to.have.status((200));
                expect(res.body.data.id).to.equal(1);
                done(err);
            })
    });
    it('should fail and return status 404 if no account is found for account_id in req.params.account_id', (done)=>{
        chai
            .request(app)
            .patch("/1/account/23")
            .end((err, res)=>{
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('No account found for ID: 23');
                done(err);
            })
    });
    it('should fail and return status 401 if no staff is found for staff_id in req.params.staff_id', (done)=>{
        chai
            .request(app)
            .patch("/23/account/1")
            .end((err, res)=>{
                expect(res).to.have.status(401);
                expect(res.body.message).to.equal('Not Authorized');
                done(err);
            })
    });
    it('should fail and return status 404 if account to delete does not exists and staff.isAdmin is true', (done)=>{
        chai
            .request(app)
            .delete('/1/account/23')
            .end((err, res)=>{
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('No account found for ID: 23')
                done(err);
            })
    });
    it('should fail and return status 401 if account to delete exists and staff does not exist', (done)=>{
        chai
            .request(app)
            .delete('/23/account/1')
            .end((err, res)=>{
                expect(res).to.have.status(401);
                expect(res.body.message).to.equal('Not Authorized')
                done(err);
            })
    });
    it('should return status 200 if Accounts array has been successfully', (done)=>{
        chai
            .request(app)
            .delete('/1/account/1')
            .end((err, res)=>{
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Account Successfully Deleted')
                done(err);
            })
    });
});