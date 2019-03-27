const User = require('./User');

class Admin extends User {
    constructor(firstname, email, password, lastname) {
        super(firstname, email, password, lastname);
        this.type = 'admin';
        this.isAdmin = true;
    }
}
module.exports = Admin;