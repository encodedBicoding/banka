import Database from '../models/Database';
import generateAccountNumber from '../helpers/generateAccountNumber';
import Transaction from '../models/Transaction';
import Account from '../models/Account';


const { users, accounts, staffs } = Database;

class Accounts {
  static createAccount(req, res) {
    const id = accounts.length + 1;
    const { accType, userType } = req.body;
    const { userId } = req.params;
    const user = users.filter(u => u.id === Number(userId));
    const accountNumber = generateAccountNumber();
    const account = new Account(id, accountNumber, accType, userType);
    account.owner = user[0].id;
    user[0].accounts.push(account);
    user[0].noOfAccounts += 1;
    accounts.push(account);
    res.status(201).json({
      status: 201,
      data: account,
    });
  }

  static changeStatus(req, res) {
    const { staffId, accountId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId) && s.isAdmin === true);
    if (staff[0].isAdmin === true) {
      const account = accounts.filter(acc => acc.id === Number(accountId));
      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'No account found',
        });
      } else {
        if (account[0].status === 'active') {
          account[0].status = 'dormant';
        } else {
          account[0].status = 'active';
        }
        res.status(200).json({
          status: 200,
          data: account,
        });
      }
    }
  }

  static deleteAccount(req, res) {
    const { staffId, accountId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId)
        && s.isAdmin === true);
    if (staff[0].isAdmin === true) {
      if (accounts.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'No account to delete',
        });
      } else {
        accounts.splice(accounts.findIndex(account => account.id === Number(accountId)));
        res.status(200).json({
          status: 200,
          message: 'Account Successfully Deleted',
          deletedBy: `${staff[0].firstname} ${staff[0].lastname}`,
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        message: `No account found for ID: ${accountId}`,
      });
    }
  }

  static debitAccount(req, res) {
    const { staffId, accountId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId) && s.type === 'staff');
    const { amount, accId } = req.body;
    if (staff[0].type === 'staff') {
      const s = `${staff[0].firstname} ${staff[0].lastname}`;
      const account = accounts.filter(acc => acc.id === Number(accountId));
      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account ID not found',
        });
      } else if (account[0].id === Number(accountId)
            && account[0].accountNumber === Number(accId)
            && account[0].balance >= amount) {
        const transaction = new Transaction(s, account[0].accountNumber, amount);
        transaction.debitAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: transaction.printTransaction(),
        });
      } else {
        res.status(401).json({
          status: 401,
          message: 'Insufficient Funds',
        });
      }
    }
  }

  static creditAccount(req, res) {
    const { staffId, accountId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId) && s.type === 'staff');
    const { amount, accId } = req.body;
    if (staff[0].type === 'staff') {
      const s = `${staff[0].firstname} ${staff[0].lastname}`;
      const account = accounts.filter(acc => acc.id === Number(accountId));
      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account ID not found',
        });
      } else if (account[0].id === Number(accountId)
          && account[0].accountNumber === Number(accId)) {
        const transaction = new Transaction(s, account[0].accountNumber, Number(amount));
        transaction.creditAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: transaction.printTransaction(),
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Invalid account number',
        });
      }
    }
  }

  static getSingleAccount(req, res) {
    const { userId } = req.params;
    const user = users.filter(client => client.id === Number(userId) && client.type === 'client');
    const acc = user[0].accounts;
    res.status(200).json({
      status: 200,
      data: acc,
    });
  }
}
export default Accounts;
