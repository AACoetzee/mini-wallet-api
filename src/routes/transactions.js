const express = require("express");

const { listTransactions } = require("../data/store");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(listTransactions());
});

module.exports = router;
