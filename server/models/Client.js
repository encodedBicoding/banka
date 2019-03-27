const User = require('./User');

class Client extends User {
    constructor(firstname, email, password) {
        super(firstname, email, password);
        this.noOfAccounts = 0;
        this.accounts = [];
        this.type = 'client';
    }
}
module.exports = Client;