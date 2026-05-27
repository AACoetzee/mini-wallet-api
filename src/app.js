const express = require("express");
const path = require("path");

const accountsRouter = require("./routes/accounts");
const transfersRouter = require("./routes/transfers");
const transactionsRouter = require("./routes/transactions");
const { authenticateApiKey } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.json({
    message: "Mini Wallet API is running!"
  });
});

app.use(authenticateApiKey);
app.use("/accounts", accountsRouter);
app.use("/transfers", transfersRouter);
app.use("/transactions", transactionsRouter);
app.use(errorHandler);

module.exports = app;
