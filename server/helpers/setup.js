import Database from '../models/Database';
import Util from './util';
import Client from '../models/Client';
import Admin from '../models/Admin';
import Staff from '../models/Staff';

class Acc {
  static setup(string, ...argument) {
    let obj;
    if (string === 'staff') {
      const id = Database.staffs.length + 1;
      const [email, password, firstName] = argument;
      const pass = Util.hashPassword(password);
      const newStaff = new Staff(firstName, email, pass);
      newStaff.id = id;
      Database.staffs.push(newStaff);
      obj = newStaff;
    } else if (string === 'admin') {
      const id = Database.staffs.length + 1;
      const [email, password, firstName] = argument;
      const pass = Util.hashPassword(password);
      const newAdmin = new Admin(firstName, email, pass);
      newAdmin.id = id;
      Database.staffs.push(newAdmin);
      obj = newAdmin;
    } else if (string === 'client') {
      const id = Database.users.length + 1;
      const [email, password, firstName, lastName] = argument;
      const pass = Util.hashPassword(password);
      const newClient = new Client(firstName, email, pass, lastName);
      newClient.id = id;
      Database.users.push(newClient);
      obj = newClient;
    }
    return obj;
  }
}

export default Acc;
