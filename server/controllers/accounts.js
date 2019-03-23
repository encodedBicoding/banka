const Users = require('../models/database').Users,
      Account = require('../models/Account'),
      generateAccountNumber = require('../helpers/generateAccountNumber');

module.exports = {
    createAccount: (req, res, next)=>{
        const { acc_type, user_type} = req.body;
        let userID = req.params.userid;
        Users.map( (user)=>{
            if(user.id === Number(userID)){
                let accountNumber = generateAccountNumber();
                let account = new Account(accountNumber, acc_type ,user_type)
                account.owner = user.id;
                user.accounts.push(account);
                user.noOfAccounts++;
                res.status(201).json({
                    status: 201,
                    data: account
                })
            }else{
                res.status(401).json({
                    status: 401,
                    message: 'Not Authorized'
                })
            }
        });
    }
}