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

function clearStore() {
  accounts.length = 0;
  transactions.length = 0;
}

function findAccountById(id) {
  return accounts.find(account => account.id === id);
}

function searchAccounts({ owner, type }) {
  return accounts.filter(account => {
    const ownerMatches = owner
      ? account.owner.toLowerCase().includes(owner.toLowerCase())
      : true;

    const typeMatches = type
      ? account.type.toLowerCase() === type.toLowerCase()
      : true;

    return ownerMatches && typeMatches;
  });
}

function updateAccountBalance(id, balance) {
  const account = findAccountById(id);

  if (!account) {
    return null;
  }

  const previousBalance = account.balance;
  const adjustmentAmount = balance - previousBalance;

  account.balance = balance;
  account.balanceUpdatedAt = new Date().toISOString();

  const transaction = createTransaction({
    type: "balance_adjustment",
    accountId: account.id,
    amount: adjustmentAmount,
    currency: account.currency,
    previousBalance,
    newBalance: balance
  });

  return {
    account,
    previousBalance,
    transaction
  };
}

function createTransaction({
  type = "transfer",
  accountId,
  fromAccountId,
  toAccountId,
  amount,
  currency,
  previousBalance,
  newBalance
}) {
  const transaction = {
    id: `txn_${transactions.length + 1}`,
    type,
    amount,
    currency,
    status: "completed",
    referenceId: `ref_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString()
  };

  if (type === "transfer") {
    transaction.fromAccountId = fromAccountId;
    transaction.toAccountId = toAccountId;
  }

  if (type === "balance_adjustment") {
    transaction.accountId = accountId;
    transaction.previousBalance = previousBalance;
    transaction.newBalance = newBalance;
  }

  transactions.push(transaction);
  return transaction;
}

function listTransactions({ accountId, status, type } = {}) {
  return transactions.filter(transaction => {
    const accountMatches = accountId
      ? transaction.accountId === accountId ||
        transaction.fromAccountId === accountId ||
        transaction.toAccountId === accountId
      : true;

    const statusMatches = status
      ? transaction.status.toLowerCase() === status.toLowerCase()
      : true;

    const typeMatches = type
      ? transaction.type.toLowerCase() === type.toLowerCase()
      : true;

    return accountMatches && statusMatches && typeMatches;
  });
}

function seedDemoData() {
  clearStore();

  const primaryAccount = createAccount({
    owner: "Jane Doe",
    type: "checking"
  });

  const secondaryAccount = createAccount({
    owner: "John Doe",
    type: "savings"
  });

  updateAccountBalance(primaryAccount.id, 1250);

  primaryAccount.balance -= 200;
  secondaryAccount.balance += 200;

  const transfer = createTransaction({
    fromAccountId: primaryAccount.id,
    toAccountId: secondaryAccount.id,
    amount: 200,
    currency: primaryAccount.currency
  });

  return {
    accounts,
    transactions,
    primaryAccountId: primaryAccount.id,
    secondaryAccountId: secondaryAccount.id,
    transferId: transfer.id
  };
}

module.exports = {
  clearStore,
  createAccount,
  createTransaction,
  findAccountById,
  listTransactions,
  searchAccounts,
  seedDemoData,
  updateAccountBalance
};
