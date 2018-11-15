import chaiHttp = require("chai-http");
import { initSwaggerMiddlware } from "../../src/middlewares/swagger";
import app from "../../src/application";

import * as chai from "chai";
const expect = chai.expect;
chai.use(chaiHttp);
describe("Hello World - Test path with parameters ", function () {
    it("should be able to return hello xxx", (done: () => void): void => {

        chai.request(app)
            .get("/api/hello?greeting=world")
            .set("content-type", "application/json")
            .send({})
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.msg).to.be.equal("hello world");
                done();
            });
    });
});

describe("Hello World - Test path with no parameters ", function () {
    it("should return an error for missing required parameters", (done: () => void): void => {

        chai.request(app)
            .get("/api/hello/")
            .set("content-type", "application/json")
            .send({})
            .end((err: Error, res: any): void => {
                expect(res.statusCode).to.be.equal(400);
                expect(res.body[0].message.trim()).to.be.equal("Missing parameter greeting in query.");
                done();
            });
    });
});
