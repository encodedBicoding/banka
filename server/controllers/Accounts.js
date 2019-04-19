import Database from '../models/Database';
import generateAccountNumber from '../helpers/generateAccountNumber';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Util from '../helpers/util';


const { users, accounts, staffs } = Database;

/**
 * @class Accounts
 */
class Accounts {
  /**
   * @description creates a user banka account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static createAccount(req, res) {
    const { accType, userType } = req.body;
    const { email } = req.user;
    try {
      const user = users.filter(u => u.email === email);
      const accountNumber = generateAccountNumber();
      const id = accounts.length + 1;
      const account = new Account(id,
        accountNumber, accType, userType,
        user[0].firstname, user[0].lastname, user[0].email);
      account.owner = user[0].id;
      user[0].accounts.push(account);
      user[0].noOfAccounts += 1;
      accounts.push(account);
      res.status(201).json({
        status: 201,
        message: 'Success',
        data: account,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }

  /**
   * @description changes user account status
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static changeStatus(req, res) {
    const { accountId } = req.params;
    try {
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
          message: 'Success',
          data: account,
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }

  /**
   * @description deletes a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static deleteAccount(req, res) {
    const { accountId } = req.params;
    const { email } = req.user;
    try {
      const staff = staffs.filter(s => s.email === email && s.isAdmin === true);
      if (accounts.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'No account to delete',
        });
      } else {
        accounts.splice(
          accounts.findIndex(account => account.id === Number(accountId)),
        );
        res.status(200).json({
          status: 200,
          message: 'Account Successfully Deleted',
          deletedBy: `${staff[0].firstname} ${staff[0].lastname}`,
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }

  /**
   * @description debits a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static debitAccount(req, res) {
    const { accountId } = req.params;
    const { amount, accId } = req.body;
    const { email } = req.user;
    try {
      const staff = staffs.filter(s => s.email === email && s.type === 'staff');
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
        const transaction = new Transaction(s, account[0].accountNumber,
          amount);
        transaction.debitAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: transaction.printTransaction(),
        });
      } else {
        res.status(401).json({
          status: 401,
          message: 'Insufficient Funds',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credential not in database',
      });
    }
  }

  /**
   * @description credits a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static creditAccount(req, res) {
    const { accountId } = req.params;
    const { amount, accId } = req.body;
    const { email } = req.user;
    try {
      const staff = staffs.filter(s => s.email === email && s.type === 'staff');
      const s = `${staff[0].firstname} ${staff[0].lastname}`;
      const account = accounts.filter(acc => acc.id === Number(accountId));
      if (account.length <= 0) {
        res.status(404).json({
          status: 404,
          message: 'Account ID not found',
        });
      } else if (account[0].id === Number(accountId)
          && account[0].accountNumber === Number(accId)) {
        const transaction = new Transaction(s, account[0].accountNumber,
          Number(amount));
        transaction.creditAccount(account[0].accountNumber);
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: transaction.printTransaction(),
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Invalid account number',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }

  /**
   * @description returns a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static getAllAccount(req, res) {
    const { email } = req.user;
    try {
      const user = users.filter(
        client => client.email === email && client.type === 'client',
      );
      const acc = user[0].accounts;
      res.status(200).json({
        status: 200,
        message: 'Success',
        data: acc,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }

  static getSingleAccountTransactions(req, res) {
    const { accountId } = req.params;
    const account = accounts.filter(
      acc => acc.accountNumber === Number(accountId),
    );
    if (account.length <= 0) {
      res.status(404).json({
        status: 404,
        message: 'Account number not found',
      });
    } else {
      const { transactions } = account[0];
      res.status(200).json({
        status: 200,
        message: 'Transaction successful',
        data: transactions,
      });
    }
  }

  static resetPassword(req, res) {
    const { newPassword, oldPassword } = req.body;
    const { email } = req.user;
    try {
      const user = users.filter(u => u.email === email);
      if (user.length <= 0) {
        const staff = staffs.filter(s => s.email === email);
        if (Util.validatePassword(oldPassword, staff[0].password)) {
          staff[0].password = Util.hashPassword(newPassword);
          res.status(200).json({
            status: 200,
            message: 'password changed successfully',
          });
        } else {
          res.status(404).json({
            status: 404,
            message: 'passwords do not match',
          });
        }
      } else if (user.length > 0) {
        if (Util.validatePassword(oldPassword, user[0].password)) {
          user[0].password = Util.hashPassword(newPassword);
          res.status(200).json({
            status: 200,
            message: 'password changed successfully',
          });
        } else {
          res.status(404).json({
            status: 404,
            message: 'passwords do not match',
          });
        }
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Error: credentials not in database',
      });
    }
  }
}
export default Accounts;
