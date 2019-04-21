const userTableQuery = `
CREATE TABLE IF NOT EXISTS users(
   id SERIAL PRIMARY KEY NOT NULL,
   firstname VARCHAR(255) NOT NULL,
   lastname VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password TEXT NOT NULL,
   type VARCHAR(10) NOT NULL DEFAULT 'client',
   isadmin VARCHAR(10) NOT NULL DEFAULT 'false',
   noofaccounts INTEGER NOT NULL DEFAULT 0,
   joined TIMESTAMP WITH TIME ZONE DEFAULT now()
)`;

const staffTableQuery = `
CREATE TABLE IF NOT EXISTS staffs(
   id SERIAL PRIMARY KEY NOT NULL,
   firstname VARCHAR(255) NOT NULL,
   lastname VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   password TEXT NOT NULL,
   type VARCHAR(10) NOT NULL,
   isadmin VARCHAR(10) NOT NULL DEFAULT 'true',
   joined TIMESTAMP WITH TIME ZONE DEFAULT now()
)`;

const accountTableQuery = `
CREATE TABLE IF NOT EXISTS accounts(
   id SERIAL NOT NULL,
   accountnumber INTEGER PRIMARY KEY NOT NULL,
   owner INTEGER REFERENCES users (id) ON DELETE CASCADE,
   ownercategory VARCHAR(25) NOT NULL,
   status VARCHAR(10) DEFAULT 'active',
   type VARCHAR(15) NOT NULL,
   balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
   lastwithdrawal TEXT DEFAULT 'no transactions yet',
   lastdeposit TEXT DEFAULT 'no transactions yet',
   createdon TIMESTAMP WITH TIME ZONE DEFAULT now()
)`;

const transactionTableQuery = `
CREATE TABLE IF NOT EXISTS transactions(
   id SERIAL PRIMARY KEY NOT NULL,
   accountnumber INTEGER NOT NULL REFERENCES accounts(accountnumber),
   type VARCHAR(15) NOT NULL,
   cashier VARCHAR(255) NOT NULL,
   amount DECIMAL(12,2) NOT NULL,
   oldbalance DECIMAL(12,2) NOT NULL,
   newbalance DECIMAL(12,2) NOT NULL,
   createdon TIMESTAMP WITH TIME ZONE DEFAULT now()
)`;

export {
  userTableQuery,
  transactionTableQuery,
  staffTableQuery,
  accountTableQuery,
};
