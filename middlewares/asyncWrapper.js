const asyncWrapper = async (req, res, next, cb) => {
  try {
    await cb();
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = asyncWrapper;
