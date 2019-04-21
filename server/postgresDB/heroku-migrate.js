import {
  userTableQuery,
  accountTableQuery,
  staffTableQuery,
  transactionTableQuery,
} from './models/createTables';
import pool from './DB/dbConnection';

const query = `${userTableQuery}${accountTableQuery}${staffTableQuery}${transactionTableQuery}`;

pool.query(query, () => {
  console.log('Tables Created');
  pool.end();
});
