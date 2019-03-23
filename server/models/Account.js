class Account{
    constructor(id, accountNumber, type, userType, ob){
        this.id = id;
        this.accountNumber = accountNumber;
        this.owner = '';
        this.type = type;
        this.ownerCategory = userType;
        this.openingBalance = ob ? ob : 0.0;
        this.createdOn = new Date(Date.now());
        this.status = 'active';
        this.balance = 0.0;
        this.lastWithdrawal = 'no transactions yet';
        this.lastDeposit = 'no transactions yet';
    }
    static makeDeposit(amt){
        this.balance += amt;
        this.lastDeposit = new Date(Date.now());
    }
    static makeWithdrawal(amt){
        this.balance > amt ? this.balance -= amt : console.log('Insufficient funds');
    }
    set Status(str){
        this.status = str;
    }
}
module.exports = Account ;