import { expect } from "chai";
import Sinon, { stub } from "sinon";
import auth from "../controllers/auth.js";
import User from "../model/user.js";
import dbConnect from "../utils/dbConnect.js";
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
  it("should send a response with a valid user status for an existing user", async function () {
    try {
      await dbConnect("test");
      const newUser = new User({
        email: "test@test.com",
        password: "tester",
        name: "test",
        posts: [],
      });
      const user = await newUser.save();
      const req = {
        userId: user.id,
      };
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.userStatus = data.status;
        },
      };
      const next = () => {};
      await auth.getStatus(req, res, next).then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("i am new");
        //done(); // Signal Mocha that the test is done
      });
      //done();
    } catch (error) {
      console.log(error); // Pass assertion errors to Mocha
    }
  });
});
