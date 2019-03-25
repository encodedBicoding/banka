const User = require('./User');

class Admin extends User{
    constructor(firstname, email, password){
        super(firstname, email, password);
        this.type = 'admin';
        this.isAdmin = true;
    }
}
module.exports = Admin;