const crypto = require("crypto");

function sendError(res, { status, code, message }) {
  return res.status(status).json({
    error: {
      code,
      message,
      requestId: `req_${crypto.randomUUID()}`
    }
  });
}

module.exports = {
  sendError
};
