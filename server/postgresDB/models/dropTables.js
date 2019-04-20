const dropUserTableQuery = 'DROP TABLE IF EXISTS users CASCADE';
const dropStaffTableQuery = 'DROP TABLE users ';
const dropAccountTableQuery = 'DROP TABLE IF EXISTS accounts CASCADE';
const dropTransactionTableQuery = 'DROP TABLE transactions';

export {
  dropAccountTableQuery,
  dropStaffTableQuery,
  dropTransactionTableQuery,
  dropUserTableQuery,
};
