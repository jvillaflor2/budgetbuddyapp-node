# BudgetBuddy

A full-stack personal finance tracker for managing income, expenses, categories, and budget goals.

Originally built with React + Flask + SQLite, then rebuilt with a React + Node.js/Express + PostgreSQL stack to deepen my hands-on experience with that combination.

## Tech Stack

**Frontend:** React, Vite, Axios, Recharts, Tailwind CSS
**Backend:** Node.js, Express
**Database:** PostgreSQL

## Features

- Add, edit, and delete income/expense categories
- Add, edit, and delete transactions, linked to categories
- Set budget limits per category and track spending against them
- Dashboard with income/expense totals, spending-by-category breakdown, and budget progress
- Month/year filtering and search across transactions
- Full CRUD REST API with parameterized SQL queries and foreign key constraints

## Project Structure

```
budgetbuddyapp-node/
├── frontend/          # React + Vite app
└── backend-node/      # Express API + PostgreSQL connection
```
## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup

```bash
cd backend-node
npm install
```

Create a `.env` file in `backend-node`:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=budgetbuddyapp
```

Create the database and tables:
```sql
CREATE DATABASE budgetbuddyapp;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL,
    budget_limit NUMERIC
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount NUMERIC NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    date DATE NOT NULL,
    note VARCHAR(200)
);
```

Run the server:
```bash
npm run dev
```
Runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /categories | Get all categories |
| GET | /categories/:id | Get one category |
| POST | /categories | Create a category |
| PUT | /categories/:id | Update a category |
| DELETE | /categories/:id | Delete a category |
| GET | /transactions | Get all transactions |
| GET | /transactions/:id | Get one transaction |
| POST | /transactions | Create a transaction |
| PUT | /transactions/:id | Update a transaction |
| DELETE | /transactions/:id | Delete a transaction |

## What I Learned

This rebuild was focused on getting hands-on with raw SQL, Express routing, and connecting a React frontend to a Node/Postgres backend — including debugging real issues like Postgres's default type parsing (dates and numeric values returning as unexpected types), building partial-update logic with `COALESCE`, and enforcing data integrity with foreign key constraints.