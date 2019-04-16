class Account {
  constructor(id, accountNumber, type, userType, fn, ln, email, ob) {
    this.id = id;
    this.accountNumber = accountNumber;
    this.firstName = fn;
    this.lastName = ln;
    this.email = email;
    this.owner = '';
    this.type = type;
    this.openingBalance = ob === undefined ? 0 : ob;
    this.ownerCategory = userType;
    this.createdOn = new Date(Date.now());
    this.status = 'active';
    this.balance = 0;
    this.lastWithdrawal = 'no transactions yet';
    this.lastDeposit = 'no transactions yet';
    this.transactions = [];
  }
}
export default Account;
