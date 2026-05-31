const express = require("express");

const {
  createAccount,
  findAccountById,
  searchAccounts,
  updateAccountBalance
} = require("../data/store");
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

router.get("/", (req, res) => {
  const { owner, type } = req.query;

  if (!owner && !type) {
    return sendError(res, {
      status: 400,
      code: "MISSING_SEARCH_QUERY",
      message: "Provide an owner or type query parameter to search accounts."
    });
  }

  return res.json({
    results: searchAccounts({ owner, type })
  });
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

router.patch("/:id/balance", (req, res) => {
  const balance = Number(req.body.balance);

  if (!Number.isFinite(balance) || balance < 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_BALANCE",
      message: "Balance must be a number greater than or equal to 0."
    });
  }

  const update = updateAccountBalance(req.params.id, balance);

  if (!update) {
    return sendError(res, {
      status: 404,
      code: "ACCOUNT_NOT_FOUND",
      message: "Account not found."
    });
  }

  return res.json({
    accountId: update.account.id,
    previousBalance: update.previousBalance,
    balance: update.account.balance,
    currency: update.account.currency,
    balanceUpdatedAt: update.account.balanceUpdatedAt,
    transaction: update.transaction
  });
});

module.exports = router;
