import {
  userTableQuery,
  transactionTableQuery,
  staffTableQuery,
  accountTableQuery,
} from './models/createTables';
import pool from './DB/dbConnection';


const query = `${userTableQuery};
               ${staffTableQuery};
               ${accountTableQuery};
               ${transactionTableQuery};
              `;
pool.query(query, (err, res) => {
  if (err) throw err;
  console.log('Tables Created');
});


