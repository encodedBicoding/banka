import pool from './DB/dbConnection';

const query2 = 'INSERT INTO staffs(firstname, lastname, email, password, type) VALUES($1, $2, $3, $4, $5)';
const value = ['dominic',
  'isioma',
  'dominicisioma000@gmail.com',
  '$2b$10$0WIvCrJLph9ZDK2EUjrGYOdHMln7EdLwgHNntY13XMLlfxcAidjoe',
  'admin'];

pool.query(query2, value, (err, res) => {
  if (err) throw err;
  console.log('Inserted');
});