const User = require('./User');

class Client extends User {
    constructor(firstname, email, password, lastname) {
        super(firstname, email, password, lastname);
        this.noOfAccounts = 0;
        this.accounts = [];
        this.type = 'client';
    }
}
module.exports = Client;