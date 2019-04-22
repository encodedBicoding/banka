import {
  userTableQuery,
  transactionTableQuery,
  staffTableQuery,
  accountTableQuery,
} from './models/createTables';
import pool from './DB/dbConnection';

const query = `${userTableQuery}${staffTableQuery}${accountTableQuery}${transactionTableQuery}`;
const query2 = 'INSERT INTO staffs(firstname, lastname, email, password) VALUES($1, $2, $3, $4)';
const value = ['dominic', 'isioma', 'dominicisioma000@gmail.com', '$2b$10$0WIvCrJLph9ZDK2EUjrGYOdHMln7EdLwgHNntY13XMLlfxcAidjoe'];

pool.query(query, () => {
  console.log('Tables created');
});
pool.query(query2, value, () => {
  console.log('Inserted');
  pool.end();
});
