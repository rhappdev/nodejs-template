import chaiHttp = require('chai-http');
import { initSwaggerMiddlware } from '../../src/middlewares/swagger';
import app from '../../src/application';

import * as chai from 'chai';
const expect = chai.expect;
chai.use(chaiHttp);
describe('Hello World - Test GET path with parameters ', function () {
    it('should be able to return hello world', (done: () => void): void => {

        chai.request(app)
            .get('/api/hello?greeting=world')
            .set('content-type', 'application/json')
            .send({})
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.msg).to.be.equal('hello world');
                done();
            });
    });
    it('should return an error for missing required parameters', (done: () => void): void => {
        chai.request(app)
            .get('/api/hello/')
            .set('content-type', 'application/json')
            .send({})
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(500);
                expect(res.body.message).to.be.equal('request.query should have required property \'greeting\'');
                done();
            });
    });
});

describe('Hello World - Test POST path with no parameters ', function () {
    it('should be able to return hello world', (done: () => void): void => {
        chai.request(app)
            .post('/api/hello')
            .set('content-type', 'application/json')
            .send({
                greeting: 'world'
            })
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.msg).to.be.equal('hello world');
                done();
            });
    });
    it('should return an error for missing required parameters', (done: () => void): void => {
        chai.request(app)
            .post('/api/hello')
            .set('content-type', 'application/json')
            .send({
            })
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(500);
                expect(res.body.message).to.be.equal('request.body should have required property \'greeting\'');
                done();
            });
    });
});
