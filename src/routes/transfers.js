const express = require("express");

const { createTransaction, findAccountById } = require("../data/store");
const { sendError } = require("../utils/errors");

const router = express.Router();

router.post("/", (req, res) => {
  const { fromAccountId, toAccountId } = req.body;
  const amount = Number(req.body.amount);

  const fromAccount = findAccountById(fromAccountId);
  const toAccount = findAccountById(toAccountId);

  if (!fromAccount || !toAccount) {
    return sendError(res, {
      status: 404,
      code: "ACCOUNT_NOT_FOUND",
      message: "One or both accounts were not found."
    });
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return sendError(res, {
      status: 400,
      code: "INVALID_TRANSFER_AMOUNT",
      message: "Amount must be greater than 0."
    });
  }

  if (fromAccount.balance < amount) {
    return sendError(res, {
      status: 400,
      code: "INSUFFICIENT_FUNDS",
      message: "The source account does not have enough balance."
    });
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const transaction = createTransaction({
    fromAccountId,
    toAccountId,
    amount,
    currency: fromAccount.currency
  });

  return res.status(201).json(transaction);
});

module.exports = router;
