const express = require("express");

const { createAccount, findAccountById } = require("../data/store");
const { sendError } = require("../utils/errors");

const router = express.Router();

router.post("/", (req, res) => {
  const { owner, type } = req.body;

  if (!owner || !type) {
    return sendError(res, {
      status: 400,
      code: "MISSING_ACCOUNT_FIELDS",
      message: "Owner and type are required."
    });
  }

  const account = createAccount({ owner, type });

  return res.status(201).json(account);
});

router.get("/:id", (req, res) => {
  const account = findAccountById(req.params.id);

  if (!account) {
    return sendError(res, {
      status: 404,
      code: "ACCOUNT_NOT_FOUND",
      message: "Account not found."
    });
  }

  return res.json(account);
});

router.get("/:id/balance", (req, res) => {
  const account = findAccountById(req.params.id);

  if (!account) {
    return sendError(res, {
      status: 404,
      code: "ACCOUNT_NOT_FOUND",
      message: "Account not found."
    });
  }

  return res.json({
    accountId: account.id,
    balance: account.balance,
    currency: account.currency
  });
});

module.exports = router;
