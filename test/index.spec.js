const chai = require('chai'),
      app = require('../app'),
      chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;
describe('Handle incoming requests', ()=>{
    it('should return status 200 and welcome message for / route', (done)=>{
        chai
            .request(app)
            .get('/')
            .end((err, res)=>{
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Welcome to api version 1 of Banka');
                done(err);
            })
    });

})
