const { sendError } = require("../utils/errors");

function authenticateApiKey(req, res, next) {
  const apiKey = req.header("x-api-key");
  const expectedApiKey = process.env.API_KEY || "demo-key-123";

  if (apiKey !== expectedApiKey) {
    return sendError(res, {
      status: 401,
      code: "UNAUTHORIZED",
      message: "Missing or invalid API key."
    });
  }

  next();
}

module.exports = {
  authenticateApiKey
};
