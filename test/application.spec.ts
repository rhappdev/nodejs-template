import chaiHttp = require("chai-http");
import * as chai from "chai";
import app from "../src/application";

const expect = chai.expect;
chai.use(chaiHttp);

describe("App", () => {
  it("works", (done: () => void): void => {
  chai.request(app)
      .get("/api/hello?greeting=world")
      .send({})
      .end((err: Error, res: any): void => {

          expect(res.statusCode).to.be.equal(200);
          expect(res.body.msg).to.be.equal("hello world");
          done();
      });

    });
});
