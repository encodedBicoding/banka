const User = require('./User'),
      Users = require('./database').Users;

class Staff extends User{
    constructor(firstname, email, password){
        super(firstname, email, password);
        this.type = 'staff';
        this.isAdmin = true;
    }
    debitClient(user, amount, id){
        if(user.type === 'client'){
            user.accounts.map((account)=>{
                if(account.id === id && account.balance > amount){
                    account.balance -= amount;
                }else if(account.id !== id){
                    console.log(`No account available for specified user`);
                    return false;
                }else{
                    console.log(`Account with ID ${id} has insufficient balance`);
                    return false;
                }
            })
        }else {
            return ("You can't debit this user")
        }
    }
    creditClientAccount(user, amount, id){
        if(user.type === 'client'){
            user.accounts.map((account)=>{
                if(account.id === id && account.balance > amount){
                    account.balance += amount;
                }else{
                    console.log(`No account available for specified user`);
                    return false;
                }
            })
        }else {
            console.log("You can't credit this user")
        }
    }
    static get allUserAccounts(){
        return {
            ...Users
        }
    }
    static deleteUser(user){
        Users.map((u)=>{
            if(u.id === user.id){
                Users.pop();
            }
        })
    }
    static deactivateAccount(user, id){
        user.accounts.map((account)=>{
            if(account.id === id){
                account.status = 'dormant'
            }
        })
    }
    static activateAccount(user, id){
        user.accounts.map((account)=>{
            if(account.id === id){
                account.status = 'active'
            }
        })
    }
}
export default Staff