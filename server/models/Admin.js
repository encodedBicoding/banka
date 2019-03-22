import User from './User';
import { Users, Staffs } from './database';

class Admin extends User{
    constructor(firstname, email, password){
        super(firstname, email, password);
        this.type = 'admin';
        this.isAdmin = true;
    }
    static get allUserAccounts(){
        return {
            users: [...Users]
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
    static createNewAdmin(user){
        Staffs.push(user);
    }
}
export default Staff