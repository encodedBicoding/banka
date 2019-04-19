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
    const query = `SELECT ${params} FROM ${this.table} WHERE id = ${id}`;
    const { rows } = await this.pool.query(query);
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
}
const userQuery = new Model('users');
const staffQuery = new Model('staffs');
const accountQuery = new Model('accounts');
const transactionQuery = new Model('transactions');

export {
  userQuery,
  staffQuery,
  accountQuery,
  transactionQuery,
};
