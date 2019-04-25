import { config } from 'dotenv';
import pool from './DB/dbConnection';

config();

const adminFirstName = process.env.ADMIN_FIRSTNAME;
const adminLastName = process.env.ADMIN_LASTNAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const query2 = 'INSERT INTO staffs(firstname, lastname, email, password, type) VALUES($1, $2, $3, $4, $5)';
const value = [adminFirstName,
  adminLastName,
  adminEmail,
  adminPassword,
  'admin'];

pool.query(query2, value, (err, res) => {
  if (err) throw err;
  console.log('Inserted');
});
