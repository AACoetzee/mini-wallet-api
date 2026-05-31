const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const accountsRouter = require("./routes/accounts");
const transfersRouter = require("./routes/transfers");
const transactionsRouter = require("./routes/transactions");
const { authenticateApiKey } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const openApiDocument = YAML.load(path.join(__dirname, "..", "openapi.yaml"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.json({
    message: "Mini Wallet API is running!"
  });
});

app.get("/openapi.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "openapi.yaml"));
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(authenticateApiKey);
app.use("/accounts", accountsRouter);
app.use("/transfers", transfersRouter);
app.use("/transactions", transactionsRouter);
app.use(errorHandler);

module.exports = app;
