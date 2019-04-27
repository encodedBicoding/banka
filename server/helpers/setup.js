import { users, staffs } from '../postgresDB/DB/index';
import Util from './util';


class Acc {
  static async setup(string, ...argument) {
    let obj;
    if (string === 'staff') {
      const [email, password, firstname, lastname] = argument;
      const pass = Util.hashPassword(password);
      try {
        obj = await staffs.insert(
          'firstname, lastname, email, password, type',
          [firstname, lastname, email, pass, 'staff'],
        );
      } catch (err) {
        throw err;
      }
    } else if (string === 'admin') {
      const [email, password, firstname, lastname] = argument;
      const pass = Util.hashPassword(password);
      try {
        obj = await staffs.insert(
          'firstname, lastname, email, password, type',
          [firstname, lastname, email, pass, 'admin'],
        );
      } catch (err) {
        throw err;
      }
    } else if (string === 'client') {
      const [email, password, firstname, lastname] = argument;
      const pass = Util.hashPassword(password);
      try {
        obj = await users.insert(
          'firstname, lastname, email, password',
          [firstname, lastname, email, pass],
        );
      } catch (err) {
        throw err;
      }
    }
    return obj;
  }
}

export default Acc;
