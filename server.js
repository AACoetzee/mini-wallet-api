const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Mini Wallet API is running!"
  });
});

app.use((req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (apiKey !== "demo-key-123") {
    return res.status(401).json({
      error: "Unauthorized. Missing or invalid API key."
    });
  }

  next();
});

const PORT = 3000;

// Fake database
let accounts = [];
let transactions = [];


// Create account
app.post("/accounts", (req, res) => {

    console.log(req.body);

  const type = req.body.type;
  const owner = req.body.owner;

  // Validation
  if (!type || !owner) {
    return res.status(400).json({
      error: "Type and owner are required"
    });
  }

  // Create account object
  const account = {
    id: `acc_${accounts.length + 1}`,
    owner: owner,
    type: type,
    balance: 1000,
    currency: "USD",
    status: "active"
  };

  // Save account
  accounts.push(account);

  // Return response
  res.status(201).json(account);

});

// Get account details
app.get("/accounts/:id", (req, res) => {

  const account = accounts.find(a => a.id === req.params.id);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  res.json(account);

});

// Get account balance
app.get("/accounts/:id/balance", (req, res) => {

  const account = accounts.find(a => a.id === req.params.id);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  res.json({
    accountId: account.id,
    balance: account.balance,
    currency: account.currency
  });

});

//for TRANSACATIONS
app.post("/transfers", (req, res) => {
    const fromAccountId = req.body.fromAccountId;
    const toAccountId = req.body.toAccountId;
    const amount = req.body.amount;
  
    const fromAccount = accounts.find(a => a.id === fromAccountId);
    const toAccount = accounts.find(a => a.id === toAccountId);
  
    if (!fromAccount || !toAccount) {
      return res.status(404).json({
        error: "One or both accounts not found"
      });
    }
  
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0"
      });
    }
  
    if (fromAccount.balance < amount) {
      return res.status(400).json({
        error: "Insufficient funds"
      });
    }
  
    fromAccount.balance = fromAccount.balance - amount;
    toAccount.balance = toAccount.balance + amount;
  
    const transaction = {
      id: `txn_${transactions.length + 1}`,
      fromAccountId: fromAccountId,
      toAccountId: toAccountId,
      amount: amount,
      status: "completed"
    };
  
    transactions.push(transaction);
  
    res.status(201).json(transaction);
  });

  app.get("/transactions", (req, res) => {
    res.json(transactions);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});