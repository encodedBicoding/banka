import Database from './Database';

const { accounts } = Database;

class Transaction {
  constructor(user, accountNumber, amount) {
    this.id = 0;
    this.createdOn = new Date(Date.now());
    this.type = '';
    this.accountNumber = accountNumber;
    this.cashier = user;
    this.amount = amount;
    this.oldBalance = 0;
    this.newBalance = 0;
  }

  debitAccount(accNumber) {
    const account = accounts.filter(acc => acc.accountNumber === accNumber);
    this.id += 1;
    this.oldBalance = account[0].balance;
    this.type = 'debit';
    account[0].balance -= this.amount;
    this.newBalance = account[0].balance;
  }

  creditAccount(accNumber) {
    const account = accounts.filter(acc => acc.accountNumber === accNumber);
    this.id += 1;
    this.oldBalance = account[0].balance;
    this.type = 'debit';
    account[0].balance += this.amount;
    this.newBalance = account[0].balance;
  }


  printTransaction() {
    return {
      TransactionId: this.id,
      createdOn: this.createdOn,
      transactionType: this.type,
      accountNumber: this.accountNumber,
      cashier: this.cashier.toLocaleUpperCase(),
      amount: this.amount,
      oldBalance: this.oldBalance,
      newBalance: this.newBalance,
    };
  }
}

module.exports = Transaction;
