import User from './User';

class Client extends User {
  constructor(firstName, email, password, lastName) {
    super(firstName, email, password, lastName);
    this.noOfAccounts = 0;
    this.accounts = [];
    this.type = 'client';
  }
}
export default Client;
