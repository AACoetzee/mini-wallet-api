# Mini Wallet API

Mini Wallet API is a small fintech-style REST API and browser demo that simulates common wallet workflows: creating accounts, checking balances, transferring funds, and viewing transaction history.

I built this project to practice the kind of API walkthroughs, integration troubleshooting, and customer-facing documentation that come up often.

## What This Project Demonstrates

- REST API design with Node.js and Express
- API key authentication using request headers
- JSON request and response workflows
- Input validation and error handling
- Automated API tests with Node's built-in test runner
- A simple browser UI for live demos
- Clear endpoint documentation for technical audiences
- A customer-style flow from account creation to transfer confirmation

## Business Use Case

This API models a simplified digital wallet platform. A customer or partner application can:

1. Create wallet accounts for users.
2. Search for accounts when the account ID is unknown.
3. Retrieve account details.
4. Check or update balances.
5. Transfer funds between accounts.
6. Review and filter transaction history.

That makes it useful as a demo project for explaining API integrations, request/response behavior, authentication, and common failure cases.

## Tech Stack

- Node.js
- Express
- HTML, CSS, and JavaScript
- REST APIs
- JSON

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create an environment file

Create a `.env` file in the project root:

```bash
API_KEY=demo-key-123
PORT=3000
```

### 3. Start the API

```bash
npm start
```

For local development with automatic restarts:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

Interactive API documentation will be available at:

```text
http://localhost:3000/docs
```

## Authentication

Protected endpoints require an API key in the `x-api-key` header.

```text
x-api-key: demo-key-123
```

If the key is missing or incorrect, the API returns:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid API key.",
    "requestId": "req_2f4f2f92-7d6d-4e88-9a2f-0a55d5a5a111"
  }
}
```

## Error Format

Errors use a consistent response shape so developers can troubleshoot failed requests more easily.

```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "The source account does not have enough balance.",
    "requestId": "req_2f4f2f92-7d6d-4e88-9a2f-0a55d5a5a111"
  }
}
```

## Postman Collection

You can test the API by importing the collection included in this repo:

```text
postman/Mini-Wallet-API.postman_collection.json
```

You can also use the shared Postman collection:

[Mini Wallet API Postman Collection](https://aac-1999.postman.co/workspace/Unit~72b83eca-0890-4b60-854b-fa3786100897/collection/25753790-c935a4f9-8a9b-415a-b30c-60ec0493edf9?action=share&source=copy-link&creator=25753790)

The collection is useful for walking through the API like a customer integration demo:

1. Create accounts.
2. Search for accounts by owner.
3. Retrieve account details.
4. Check and update balances.
5. Transfer funds.
6. View and filter transaction history.
7. Test error cases like missing authentication, invalid balances, or insufficient funds.

## OpenAPI Documentation

This project includes an OpenAPI contract at:

```text
openapi.yaml
```

When the server is running, you can view and test the API in Swagger UI:

```text
http://localhost:3000/docs
```

Use this API key in Swagger's **Authorize** button:

```text
demo-key-123
```

## Example API Flow

### Load Demo Data

```http
POST /demo/seed
```

This resets the in-memory demo data and creates two accounts, one balance adjustment, and one transfer.

### Create Account

```http
POST /accounts
```

Request:

```json
{
  "owner": "Jane Doe",
  "type": "checking"
}
```

Response:

```json
{
  "id": "acc_1",
  "owner": "Jane Doe",
  "type": "checking",
  "balance": 1000,
  "currency": "USD",
  "status": "active"
}
```

### Get Account Details

```http
GET /accounts/acc_1
```

### Find Accounts Without an ID

```http
GET /accounts?owner=Jane
```

Optional filters:

```http
GET /accounts?owner=Jane&type=checking
```

Response:

```json
{
  "results": [
    {
      "id": "acc_1",
      "owner": "Jane Doe",
      "type": "checking",
      "balance": 1000,
      "currency": "USD",
      "status": "active"
    }
  ]
}
```

### Get Account Balance

```http
GET /accounts/acc_1/balance
```

### Update Account Balance

```http
PATCH /accounts/acc_1/balance
```

Request:

```json
{
  "balance": 1250
}
```

Response:

```json
{
  "accountId": "acc_1",
  "previousBalance": 1000,
  "balance": 1250,
  "currency": "USD",
  "balanceUpdatedAt": "2026-05-27T14:30:00.000Z",
  "transaction": {
    "id": "txn_1",
    "type": "balance_adjustment",
    "accountId": "acc_1",
    "amount": 250,
    "previousBalance": 1000,
    "newBalance": 1250,
    "currency": "USD",
    "status": "completed"
  }
}
```

### Transfer Funds

```http
POST /transfers
```

Request:

```json
{
  "fromAccountId": "acc_1",
  "toAccountId": "acc_2",
  "amount": 200
}
```

Response:

```json
{
  "id": "txn_1",
  "type": "transfer",
  "fromAccountId": "acc_1",
  "toAccountId": "acc_2",
  "amount": 200,
  "currency": "USD",
  "status": "completed",
  "referenceId": "ref_7e6d9822-44d1-45fc-90c2-c1eb24f2175f",
  "createdAt": "2026-05-26T18:30:00.000Z"
}
```

### View Transaction History

```http
GET /transactions
```

Optional filters:

```http
GET /transactions?accountId=acc_1&type=transfer&status=completed
```

## Demo Walkthrough

A simple demo flow for this project:

1. Start the server with `npm start`.
2. Open `http://localhost:3000`.
3. Click **Load Demo Accounts** or create two accounts manually.
4. Search for an account by owner name if you do not remember the account ID.
5. Check the balance for the first account.
6. Update a balance with `PATCH /accounts/:id/balance`.
7. Confirm the balance update appears as a `balance_adjustment` transaction.
8. Transfer funds from the first account to the second account.
9. Filter transaction history by account ID, type, or status.
10. Try an invalid request, such as a transfer with insufficient funds, to show error handling.

## Project Structure

```text
src/
  app.js                  Express app setup and route wiring
  server.js               Server startup
  data/store.js           In-memory account and transaction store
  middleware/auth.js      API key authentication
  middleware/errorHandler.js
  routes/accounts.js      Account creation, search, lookup, and balance routes
  routes/demo.js          Demo data seeding route
  routes/transfers.js     Transfer route and validation
  routes/transactions.js  Transaction history and filtering route
  utils/errors.js         Shared structured error response helper
test/
  api.test.js             Automated API flow tests
```

## Tests

Run the automated API tests with:

```bash
npm test
```

The tests cover account creation, account search, balance updates, adjustment history, transfers, transaction filters, demo seeding, missing auth, and insufficient funds.

## What I Learned

Through this project I practiced:

- Designing REST endpoints around a realistic workflow
- Explaining API behavior through clear examples
- Handling authentication with request headers
- Validating request data before changing application state
- Returning useful status codes and error messages
- Building a small UI to make an API easier to demo
- Thinking about developer experience from a customer perspective

## Future Improvements

- Persist data with a database instead of in-memory arrays
- Add pagination for transaction history
