const Users = require('../models/database').Users,
      Accounts = require('../models/database').Accounts,
      Staffs = require('../models/database').Staffs,
      Account = require('../models/Account'),
      generateAccountNumber = require('../helpers/generateAccountNumber'),
      Transaction = require('../models/Transaction');

module.exports = {
    createAccount: (req, res) => {
        const { acc_type, user_type } = req.body;
        let { user_id } = req.params;
        let id =0;
        let user = Users.filter( user => user.id === Number(user_id)),
            accountNumber =  generateAccountNumber(),
            account = new Account(id + 1, accountNumber, acc_type, user_type);
        account.owner = user[0].id;
        user[0].accounts.push(account);
        user[0].noOfAccounts++;
        Accounts.push(account);
        res.status(201).json({
            status: 201,
            data: account
        });
    },
    changeStatus: (req, res) => {
        const { staff_id, account_id } = req.params;
        let staff = Staffs.filter(staff => staff.id === Number(staff_id) && staff.isAdmin === true);
        if (staff[0].isAdmin === true) {
            let account = Accounts.filter(account => account.id === Number(account_id));
            if(account.length <= 0){
                res.status(404).json({
                        status: 404,
                        message: 'No account found'
                    });
             } else {
                account[0].status === 'active' ? account[0].status = "dormant" : account[0].status = "active";
                    res.status(200).json({
                        status: 200,
                        data: account[0]
                    });
            }
        }
    },
    deleteAccount: (req, res)=>{
        const { staff_id, account_id } = req.params;
        let staff = Staffs.filter( staff => staff.id === Number(staff_id)
            && staff.isAdmin === true);
        if(staff[0].isAdmin === true){
            if(Accounts.length <= 0){
                res.status(404).json({
                    status: 404,
                    message: 'No account to delete'
                })
            } else {
                Accounts.splice( Accounts.findIndex( account => account.id === Number(account_id)));
                res.status(200).json({
                    status: 200,
                    message: 'Account Successfully Deleted',
                    deletedBy: staff[0].firstname + " " + staff[0].lastname
                })
            }
        } else {
            res.status(404).json({
                status: 404,
                message: `No account found for ID: ${account_id}`
            })
        }
    },
    debitAccount: (req, res) => {
        let { staff_id, account_id } = req.params;
        let staff = Staffs.filter(staff => staff.id === Number(staff_id) && staff.type === 'staff');
        let { amount, acc_id } = req.body;
        if (staff[0].type === 'staff') {
            let s = `${staff[0].firstname} ${staff[0].lastname}`;
            let account = Accounts.filter(account => account.id === Number(account_id));
            if (account.length <= 0) {
                res.status(404).json({
                    status: 404,
                    message: 'Account ID not found' });
            } else {
                if (account[0].id === Number(account_id)
                    && account[0].accountNumber === Number(acc_id)
                    && account[0].balance >= amount){
                    let transaction = new Transaction(s, account[0].accountNumber, amount);
                    transaction.debitAccount(account[0].accountNumber);
                    res.status(200).json({
                        status: 200,
                        message: transaction.printTransaction()
                    });
                } else {
                    res.status(401).json({
                        status: 401,
                        message: "Insufficient Funds" });
                }
            }
        }
    },
    creditAccount: (req, res) => {
        let { staff_id, account_id } = req.params;
        let staff = Staffs.filter(staff => staff.id === Number(staff_id) && staff.type === 'staff');
        let { amount, acc_id } = req.body;
        if (staff[0].type === 'staff') {
            let s = `${staff[0].firstname} ${staff[0].lastname}`;
            let account = Accounts.filter(account => account.id === Number(account_id));
            if (account.length <= 0) {
                res.status(404).json({
                    status: 404,
                    message: 'Account ID not found' });
            } else {
                if (account[0].id === Number(account_id)
                    && account[0].accountNumber === Number(acc_id)){
                    let transaction = new Transaction(s, account[0].accountNumber, Number(amount));
                    transaction.creditAccount(account[0].accountNumber);
                    res.status(200).json({
                        status: 200,
                        message: transaction.printTransaction() });
                }
            }
        }
    },
    getSingleAccount: (req, res) => {
        let { user_id } = req.params;
        let user = Users.filter(client => client.id === Number(user_id) && client.type === 'client');
        let accounts = user[0].accounts;
        res.status(200).json({
            status: 200,
            data: accounts
        });
    }
};