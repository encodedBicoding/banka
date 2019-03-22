const User = require('./User');

class Client extends User{
    constructor(firstname,email,password){
        super(firstname, email, password);
        this.noOfAccounts = 0;
        this.accounts = [];
        this.type = 'client';
    }
    createAccount(account){
        this.accounts.push(account);
    }
    get AllAccounts(){
        return {
            ...this.accounts
        }
    }
}
module.exports = Client