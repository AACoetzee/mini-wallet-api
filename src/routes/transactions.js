const express = require("express");

const { listTransactions } = require("../data/store");

const router = express.Router();

router.get("/", (req, res) => {
  const { accountId, status, type } = req.query;

  res.json(listTransactions({ accountId, status, type }));
});

module.exports = router;
