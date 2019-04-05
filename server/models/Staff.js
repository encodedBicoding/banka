import User from './User';

class Staff extends User {
  constructor(firstname, email, password, lastname) {
    super(firstname, email, password, lastname);
    this.type = 'staff';
    this.isAdmin = true;
  }
}
export default Staff;
