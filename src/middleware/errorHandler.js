const { sendError } = require("../utils/errors");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  return sendError(res, {
    status: err.status || 500,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Something went wrong."
  });
}

module.exports = {
  errorHandler
};
