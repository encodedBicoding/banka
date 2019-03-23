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
}
module.exports = Account ;