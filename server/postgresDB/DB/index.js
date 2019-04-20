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
      insertValue = '$1, $2, $3, $4, $5, $6, $7';
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

  async findByEmail(params, email) {
    const query = `SELECT ${params} FROM ${this.table} WHERE email = $1`;
    const { rows } = await this.pool.query(query, email);
    return rows[0];
  }

  async findMany() {
    const query = `SELECT * FROM ${this.table} returning *`;
    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async updateById(params, id) {
    const query = `UPDATE ${this.table} SET ${params} WHERE id = ${id} returning *`;
    const { rows } = await this.pool.query(query);
    return rows[0];
  }

  async deleteById(id) {
    const query = `DELETE FROM ${this.table} WHERE id = ${id} returning *`;
    const { rows } = await this.pool.query(query);
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
