import jwt from "jsonwebtoken";
const isAuth = (req, res, next) => {
  let token;
  const tokenHeaders =
    req.headers["Authorization"] || req.headers["authorization"];
  if (tokenHeaders) {
    token = tokenHeaders.split(" ");
    if (!token[1]) {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }
  } else {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }

  // try {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const result = jwt.verify(token[1], JWT_SECRET_KEY);
  if (result) {
    req.userId = result.userId; // Set user info to request object
    return next();
  } else {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }
  /* } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return next(err);
  } */
};

export default isAuth;
