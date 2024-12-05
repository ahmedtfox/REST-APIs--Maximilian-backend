import { expect } from "chai";
import Sinon, { stub } from "sinon";
import auth from "../controllers/auth.js";
import User from "../model/user.js";

describe("Auth Middleware", () => {
  it("should throw a 500 error if accessing the database fails", async function (done) {
    // Stub the findOne method to throw an error
    Sinon.stub(User, "findOne").throws();
    const req = {
      body: {
        email: "test@mail.com",
        password: "tester",
      },
    };
    const res = {};
    const next = (err) => {
      try {
        expect(err).to.be.an("error");
        expect(err).to.have.property("statusCode", 500);
        done(); // Signal Mocha that the test is done
      } catch (assertionError) {
        done(assertionError); // Pass assertion errors to Mocha
      } finally {
        User.findOne.restore(); // Clean up the stub
      }
    };
    auth.login(req, res, next);
  });
});
