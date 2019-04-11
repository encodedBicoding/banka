import User from './User';

class Admin extends User {
  constructor(firstName, email, password, lastName) {
    super(firstName, email, password, lastName);
    this.type = 'admin';
    this.isAdmin = true;
  }
}
export default Admin;
