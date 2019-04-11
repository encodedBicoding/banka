import User from './User';

class Staff extends User {
  constructor(firstName, email, password, lastName) {
    super(firstName, email, password, lastName);
    this.type = 'staff';
    this.isAdmin = true;
  }
}
export default Staff;
