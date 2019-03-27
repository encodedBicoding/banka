const User = require('./User');

class Staff extends User {
    constructor(firstname, email, password, lastname) {
        super(firstname, email, password, lastname);
        this.type = 'staff';
        this.isAdmin = true;
    }
}
module.exports = Staff;