import User from './User';

class Admin extends User {
  constructor(firstname, email, password, lastname) {
    super(firstname, email, password, lastname);
    this.type = 'admin';
    this.isAdmin = true;
  }
}
export default Admin;
