const assert = require("node:assert/strict");
const test = require("node:test");

const app = require("../src/app");
const { clearStore } = require("../src/data/store");

const API_KEY = "demo-key-123";

function startTestServer() {
  return new Promise(resolve => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise(done => server.close(done))
      });
    });
  });
}

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...options.headers
    }
  });

  const body = await response.json();

  return {
    body,
    status: response.status
  };
}

test.beforeEach(() => {
  clearStore();
});

test("creates an account", async () => {
  const server = await startTestServer();

  try {
    const { body, status } = await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "Jane Doe",
        type: "checking"
      })
    });

    assert.equal(status, 201);
    assert.equal(body.id, "acc_1");
    assert.equal(body.owner, "Jane Doe");
    assert.equal(body.balance, 1000);
  } finally {
    await server.close();
  }
});

test("searches accounts by owner", async () => {
  const server = await startTestServer();

  try {
    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "Jane Doe",
        type: "checking"
      })
    });

    const { body, status } = await request(server.baseUrl, "/accounts?owner=Jane");

    assert.equal(status, 200);
    assert.equal(body.results.length, 1);
    assert.equal(body.results[0].id, "acc_1");
  } finally {
    await server.close();
  }
});

test("updates balance and creates adjustment history", async () => {
  const server = await startTestServer();

  try {
    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "Jane Doe",
        type: "checking"
      })
    });

    const update = await request(server.baseUrl, "/accounts/acc_1/balance", {
      method: "PATCH",
      body: JSON.stringify({
        balance: 1250
      })
    });

    assert.equal(update.status, 200);
    assert.equal(update.body.previousBalance, 1000);
    assert.equal(update.body.balance, 1250);
    assert.equal(update.body.transaction.type, "balance_adjustment");

    const history = await request(
      server.baseUrl,
      "/transactions?accountId=acc_1&type=balance_adjustment"
    );

    assert.equal(history.status, 200);
    assert.equal(history.body.length, 1);
    assert.equal(history.body[0].newBalance, 1250);
  } finally {
    await server.close();
  }
});

test("transfers funds and filters transactions by account", async () => {
  const server = await startTestServer();

  try {
    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "Jane Doe",
        type: "checking"
      })
    });

    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "John Doe",
        type: "savings"
      })
    });

    const transfer = await request(server.baseUrl, "/transfers", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc_1",
        toAccountId: "acc_2",
        amount: 200
      })
    });

    assert.equal(transfer.status, 201);
    assert.equal(transfer.body.type, "transfer");

    const transactions = await request(
      server.baseUrl,
      "/transactions?accountId=acc_1&type=transfer&status=completed"
    );

    assert.equal(transactions.status, 200);
    assert.equal(transactions.body.length, 1);
    assert.equal(transactions.body[0].fromAccountId, "acc_1");
  } finally {
    await server.close();
  }
});

test("rejects missing API key", async () => {
  const server = await startTestServer();

  try {
    const response = await fetch(`${server.baseUrl}/accounts/acc_1/balance`);
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, "UNAUTHORIZED");
  } finally {
    await server.close();
  }
});

test("rejects insufficient funds", async () => {
  const server = await startTestServer();

  try {
    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "Jane Doe",
        type: "checking"
      })
    });

    await request(server.baseUrl, "/accounts", {
      method: "POST",
      body: JSON.stringify({
        owner: "John Doe",
        type: "savings"
      })
    });

    const transfer = await request(server.baseUrl, "/transfers", {
      method: "POST",
      body: JSON.stringify({
        fromAccountId: "acc_1",
        toAccountId: "acc_2",
        amount: 999999
      })
    });

    assert.equal(transfer.status, 400);
    assert.equal(transfer.body.error.code, "INSUFFICIENT_FUNDS");
  } finally {
    await server.close();
  }
});

test("loads demo data", async () => {
  const server = await startTestServer();

  try {
    const demo = await request(server.baseUrl, "/demo/seed", {
      method: "POST"
    });

    assert.equal(demo.status, 201);
    assert.equal(demo.body.accounts.length, 2);
    assert.equal(demo.body.transactions.length, 2);
    assert.equal(demo.body.primaryAccountId, "acc_1");
  } finally {
    await server.close();
  }
});
