import { expect } from "chai";
import isAuth from "../middlewares/is-auth.js";

describe("Auth Middleware", () => {
  it("should throw an error if no Authorization header is present", () => {
    const req = {
      headers: {
        Authorization: null,
      },
    }; // Simulating no Authorization header
    const res = {};
    const next = () => {};

    expect(() => isAuth(req, res, next)).to.throw("Invalid token");
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      headers: {
        Authorization: "xyz",
      },
    }; // Simulating no Authorization header
    const res = {};
    const next = () => {};

    expect(() => isAuth(req, res, next)).to.throw();
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      headers: {
        Authorization: "Bearer xyz",
      },
    }; // Simulating no Authorization header
    const res = {};
    const next = () => {};

    expect(() => isAuth(req, res, next)).to.throw();
  });
});
