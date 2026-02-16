# Pandar In-Memory Wallet API

This is a Node.js (NestJS) API implementation for an in-memory wallet system, following the requested pattern of a repository-based architecture.

## Features

- **User Authentication**: JWT-based authentication.
- **Wallet Balanced**: Manage user balances with initial 10,000 credit.
- **Transactions**: Double-entry ledger for all balance mutations.
- **Idempotency**: mutation endpoints (`/add_balance`, `/withdraw`) require and enforce an `Idempotency-Key` header.
- **Concurrency Safety**: In-memory mutex locks ensure balance integrity even with concurrent requests.
- **Rate Limiting**: mutating endpoints are rate-limited to 10 requests per minute per IP.
- **Error Handling**: Global exception filtering for consistent JSON error responses without stack traces.

## Setup Instructions

1.  **Clone the repository** (if applicable) or enter the project directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file (optional, defaults are provided):
    ```env
    PORT=3000
    JWT_SECRET=your_secret_key
    ```
4.  **Run the application**:
    ```bash
    # Development mode
    npm run start:dev
    
    # Production mode
    npm run start:prod
    ```

## API Endpoints

### 1. Register/Login User
`POST /api/user`
- Body: `{ "email": "user@example.com" }`
- Returns: JWT Token and user info.

### 2. Get Balance
`GET /api/balance`
- Header: `Authorization: Bearer <token>`
- Returns: Current wallet balance.

### 3. Add Balance
`POST /api/add_balance`
- Header: `Authorization: Bearer <token>`, `Idempotency-Key: <unique_key>`
- Body: `{ "amount": 5000 }`
- Features: Idempotent, records to ledger.

### 4. Withdraw
`POST /api/withdraw`
- Header: `Authorization: Bearer <token>`, `Idempotency-Key: <unique_key>`
- Body: `{ "amount": 1000 }`
- Features: Idempotent, concurrency safe, balance check.

### 5. Transaction History
`GET /api/transactions`
- Header: `Authorization: Bearer <token>`
- Query: `?page=1&limit=10`
- Returns: Paginated transaction history (most recent first).

## Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```
