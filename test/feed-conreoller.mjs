import { expect } from "chai";
import Sinon, { stub } from "sinon";
import feed from "../controllers/feed.js";
import User from "../model/user.js";
import Post from "../model/post.js";
import io from "../socket.js";
import { dbConnect, dbDisconnect } from "../utils/dbConnect.js";
describe("Feed Controller", () => {
  let ioStub;
  before(async function () {
    try {
      await dbConnect("test");
      await User.deleteMany({});
      await Post.deleteMany({});
      // Stub io.getIO()
      ioStub = stub(io, "getIO").returns({
        emit: stub(), // Stub emit method
      });
    } catch (err) {}
  });
  after(async function () {
    await User.deleteMany({});
    await Post.deleteMany({});
    await dbDisconnect();
    ioStub.restore();
  });

  it("should add a created post to the posts of the creator", async function () {
    const dummyUserId = "6751afcb1e336b983c0d630a";

    const newUser = new User({
      email: "test@test.com",
      password: "tester",
      name: "test",
      posts: [],
      _id: dummyUserId,
    });
    await newUser.save();
    const req = {
      body: {
        title: "Test post",
        content: "A Test post",
      },
      file: {
        path: "abc",
      },
      userId: dummyUserId,
    };
    const res = {
      statusCode: 500,
      data: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };
    const next = () => {};
    await feed
      .createPost(req, res, next)
      .then(() => {
        expect(res.data.message).to.be.equal("post created successfully!");
        expect(res.statusCode).to.be.equal(201);
        const creatorId = res.data.creator._id.toString();
        expect(creatorId).to.be.equal(dummyUserId);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
