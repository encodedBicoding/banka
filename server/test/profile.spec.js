const chai = require('chai'),
    app = require('../app'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

describe('Handle user and staff profile uploads', ()=>{
    it('should return status 200 if image url is a valid one', (done)=>{
        chai
            .request(app)
            .put('/api/v1/client/1/uploads')
            .send({
                imageUrl: 'dom.jpg'
            })
            .end((err, res)=>{
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Upload success')
                done();
            })
    });
    it('should fail with  status 406 if image url is an invalid one', (done)=>{
        chai
            .request(app)
            .put('/api/v1/client/1/uploads')
                .send({
                imageUrl: 'dom.jsdf'
            })
            .end((err, res)=>{
                expect(res).to.have.status(406)
                done();
            })
    })
})