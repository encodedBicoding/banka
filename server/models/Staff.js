const User = require('./User');

class Staff extends User{
    constructor(firstname, email, password){
        super(firstname, email, password);
        this.type = 'staff';
        this.isAdmin = true;
    }
}
module.exports = Staff;