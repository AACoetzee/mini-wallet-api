# Mini Wallet API

A small REST API wallet simulation built using Node.js, Express, and Postman.

## Features

- Create accounts
- Get account details
- Get balances
- Transfer funds
- View transaction history
- Error handling
- JSON request/response workflows

## Technologies

- Node.js
- Express
- Postman
- REST APIs
- JSON

## Example Endpoints

### Create Account

POST /accounts

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

### Transfer Funds

POST /transfers

```json
{
  "fromAccountId": "acc_1",
  "toAccountId": "acc_2",
  "amount": 200
}
```
## UI Screenshots

### Mini Wallet Dashboard

![Mini Wallet Dashboard](images/home.png)

### Account Created

![Account Created](images/account-created.png)

### Balance Lookup

![Balance Lookup](images/balance.png)

### Transfer Funds

![Transfer Funds](images/transfer.png)

### Transaction History

![Transaction History](images/transactions.png)

## What I Learned

Through this project I learned:
- REST API design
- Request/response lifecycles
- Express routing
- JSON payload handling
- Status codes and validation
- API testing with Postman
- Backend debugging workflows