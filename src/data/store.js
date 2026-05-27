const crypto = require("crypto");

const accounts = [];
const transactions = [];

function createAccount({ owner, type }) {
  const account = {
    id: `acc_${accounts.length + 1}`,
    owner,
    type,
    balance: 1000,
    currency: "USD",
    status: "active"
  };

  accounts.push(account);
  return account;
}

function findAccountById(id) {
  return accounts.find(account => account.id === id);
}

function createTransaction({ fromAccountId, toAccountId, amount, currency }) {
  const transaction = {
    id: `txn_${transactions.length + 1}`,
    fromAccountId,
    toAccountId,
    amount,
    currency,
    status: "completed",
    referenceId: `ref_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString()
  };

  transactions.push(transaction);
  return transaction;
}

function listTransactions() {
  return transactions;
}

module.exports = {
  createAccount,
  createTransaction,
  findAccountById,
  listTransactions
};
