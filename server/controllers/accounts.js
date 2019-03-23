const Users = require('../models/database').Users,
      Accounts = require('../models/database').Accounts,
      Staffs = require('../models/database').Staffs,
      Account = require('../models/Account'),
      generateAccountNumber = require('../helpers/generateAccountNumber');

module.exports = {
    createAccount: (req, res)=>{
        const { acc_type, user_type} = req.body;
        let userID = req.params.userid;
        Users.map( (user)=>{
            if(user.id === Number(userID)){
                let accountNumber = generateAccountNumber();
                let id = Accounts.length + 1;
                let account = new Account(id,accountNumber, acc_type ,user_type)
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
    },
    changeStatus: (req, res)=>{
        const {staff_id, account_id} = req.params;
        Staffs.map((staff)=>{
            if(staff.id === Number(staff_id) && staff.isAdmin === true){
                Accounts.map((account)=>{
                    if(account.id === Number(account_id)){
                        (account.status === 'active')?account.status = "dormant" : account.status = "active";
                        res.status(200).json({
                            status: 200,
                            data: account
                        })
                    }else{
                        res.status(404).json({
                            status: 404,
                            message: `No account found for ID: ${account_id}`
                        })
                    }
                })
            } else{
                res.status(401).json({
                    status: 401,
                    message: 'Not Authorized'
                })
            }
        })

    }
}