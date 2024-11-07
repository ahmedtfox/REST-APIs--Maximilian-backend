const User = require("../model/user");
const bcrypt = require("bcryptjs");


exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const passwordText = req.body.password;
  const name = req.body.name;
  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      const err = new Error("this email already exist");
      err.statusCode = 422;
      /*     throw err; */
      return next(err);
    }
    const password = await bcrypt.hash(passwordText, 12);
    const newUser = new User({
      email,
      password,
      name,
    });

    const result = await newUser.save();
    res.status(201).json({
      message: "post created successfully!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
