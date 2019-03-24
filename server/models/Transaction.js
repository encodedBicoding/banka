const Accounts = require('./database').Accounts;

class Transaction{
    constructor(user, accountNumber, amount){
        this.id = 0;
        this.createdOn = new Date(Date.now());
        this.type = '';
        this.accountNumber = accountNumber;
        this.cashier = user.id;
        this.amount = amount;
        this.oldBalance = 0;
        this.newBalance = 0;
    }
    debitAccount(acc_number){
        Accounts.map((account)=>{
            if(account.accountNumber === acc_number){
                this.id += 1;
                this.oldBalance = account.balance;
                this.type = 'debit';
                account.balance -= this.amount;
                this.newBalance = account.balance;
                return {
                        id: this.id,
                        createdOn: this.createdOn,
                        type: this.type,
                        accountNumber: this.accountNumber,
                        cashier: this.cashier,
                        amount: this.amount,
                        oldBalance: this.oldBalance,
                        newBalance: this.newBalance
                }
            }
        });
    }
}

module.exports = Transaction;