const chai = require('chai'),
      app = require('../app'),
      chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
describe('Testing user account creation on route /api/v1/:userid/accounts', ()=>{
    it('should return status 200 and owner id if userid is found', (done)=>{
        chai
            .request(app)
            .post('/api/v1/1/accounts')
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
            .post('/api/v1/2/accounts')
            .send({
                acc_type: 'current',
                user_type: 'org'
            })
            .end((err, res)=>{
                expect(res).to.have.status(401);
                expect(res.body.message).to.equal('Not Authorized');
                done(err);
            })
    })

})