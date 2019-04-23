import pool from './dbConnection';

class Model {
  constructor(table) {
    this.table = table;
    this.pool = pool;
  }

  generateInsertString() {
    let insertValue;
    if (this.table === 'users' || this.table === 'accounts') {
      insertValue = '$1, $2, $3, $4';
    } else if (this.table === 'staffs') {
      insertValue = '$1, $2, $3, $4, $5';
    } else if (this.table === 'transactions') {
      insertValue = '$1, $2, $3, $4, $5, $6';
    }
    return insertValue;
  }

  async insert(params, condition) {
    const query = `INSERT INTO ${this.table}(${params}) VALUES(${this.generateInsertString()}) returning *`;
    const { rows } = await this.pool.query(query, condition);
    return rows[0];
  }

  async findById(params, id) {
    const query = `SELECT ${params} FROM ${this.table} WHERE id = $1`;
    const { rows } = await this.pool.query(query, id);
    return rows[0];
  }

  async findByAccountNumber(params, accountnumber) {
    const query = `SELECT ${params} FROM ${this.table} WHERE accountnumber = $1`;
    const { rows } = await this.pool.query(query, accountnumber);
    return rows[0];
  }

  async findByEmail(params, email) {
    const query = `SELECT ${params} FROM ${this.table} WHERE email = $1`;
    const { rows } = await this.pool.query(query, email);
    return rows[0];
  }

  async findByOwnerID(params, email) {
    const query = `SELECT ${params} FROM ${this.table} WHERE owner = $1`;
    const { rows } = await this.pool.query(query, email);
    return rows[0];
  }

  async findMany() {
    const query = `SELECT * FROM ${this.table}`;
    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async updateById(params, id) {
    const query = `UPDATE ${this.table} SET ${params} WHERE id = ${id} returning *`;
    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async updateStatusById(params, id) {
    const query = `UPDATE ${this.table} SET STATUS = '${params}' WHERE id = ${id} returning *`;
    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async deleteById(id) {
    const query = `DELETE FROM ${this.table} WHERE id = $1 returning *`;
    const { rows } = await this.pool.query(query, id);
    return rows[0];
  }

  async deleteByAccountNumber(accNumber) {
    const query = `DELETE FROM ${this.table} WHERE accountnumber = $1 returning *`;
    const { rows } = await this.pool.query(query, accNumber);
    return rows[0];
  }

  async dropTable() {
    const query = `DROP TABLE IF EXISTS ${this.table}`;
    return this.pool.query(query);
  }

  createUsersTable() {
    const query = `
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
    return this.pool.query(query);
  }

  createStaffsTable() {
    const query = `
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
    return this.pool.query(query);
  }

  createTransactionTable() {
    const query = `
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
    return this.pool.query(query);
  }

  createAccountsTable() {
    const query = `
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
    return this.pool.qury(query);
  }
}
const users = new Model('users');
const staffs = new Model('staffs');
const accounts = new Model('accounts');
const transactions = new Model('transactions');

export {
  users,
  staffs,
  accounts,
  transactions,
};
