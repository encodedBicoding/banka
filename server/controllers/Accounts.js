import generateAccountNumber from '../helpers/generateAccountNumber';
import Util from '../helpers/util';
import pool from '../postgresDB/DB/dbConnection';
import { accountTableQuery } from '../postgresDB/models/createTables';

import {
  users, accounts, staffs, transactions,
} from '../postgresDB/DB/index';

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
  static async createAccount(req, res) {
    const { accType, userType } = req.body;
    const { email } = req.user;
    try {
      const user = await users.findByEmail('*', [email]);
      const accountNumber = generateAccountNumber();
      await pool.query(accountTableQuery);
      const account = await accounts.insert(
        'accountnumber, owner, ownercategory, type',
        [accountNumber, user.id, userType, accType],
      );
      const noOfAccount = user.noofaccounts + 1;
      await users.updateById(`noofaccounts = ${noOfAccount}`, [user.id]);
      res.status(201).json({
        status: 201,
        message: 'Bank account created successfully',
        data: account,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }

  /**
   * @description changes user account status
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */

  static async changeStatus(req, res) {
    const { accountNumber } = req.params;
    let updated;
    try {
      const account = await accounts.findByAccountNumber('*', [accountNumber]);
      if (account.status === 'active') {
        updated = await accounts.updateStatusById('dormant', `${account.id}`);
        res.status(200).json({
          status: 200,
          message: `Account status changed to ${updated.status}`,
          data: updated,
        });
      } else {
        updated = await accounts.updateStatusById('active', `${account.id}`);
        res.status(200).json({
          status: 200,
          message: `Account status changed to ${updated.status}`,
          data: updated,
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }

  /**
   * @description deletes a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    const { email } = req.user;
    try {
      const staff = await staffs.findByEmail('firstname, lastname', [email]);
      const accountToDelete = await accounts.findByAccountNumber('*', [accountNumber]);
      await transactions.deleteByAccountNumber([accountToDelete.accountnumber]);
      await accounts.deleteById([accountToDelete.id]);
      const user = await users.findById('*', [accountToDelete.owner]);
      const subtractNoOfAccount = Number(user.noofaccounts) - 1;
      await users.updateById(`noofaccounts = '${subtractNoOfAccount}'`, [user.id]);
      res.status(200).json({
        status: 200,
        message: 'Account Successfully Deleted',
        deletedBy: `${staff.firstname} ${staff.lastname}`,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }

  /**
   * @description debits a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static async debitAccount(req, res) {
    const { accountNumber } = req.params;
    const { amount, accountnumber } = req.body;
    const { email } = req.user;
    try {
      const staff = await staffs.findByEmail('*', [email]);
      const s = `${staff.firstname} ${staff.lastname}`;
      const account = await accounts.findByAccountNumber('*', [accountnumber]);
      if (account.balance >= amount) {
        const debit = {
          balance: account.balance - amount,
          date: new Date().toUTCString(),
        };
        const updated = await accounts.updateById(`balance = '${debit.balance}', lastwithdrawal = '${debit.date}'`, [account.id]);
        await transactions.createTransactionTable();
        const transaction = await transactions.insert(
          'accountnumber, type, cashier, amount, oldbalance, newbalance',
          [account.accountnumber, 'debit', s, amount, account.balance, updated.balance],
        );
        res.status(200).json({
          status: 200,
          message: 'Account debited successfully',
          data: transaction,
        });
      } else if (Number(accountNumber) !== account.accountnumber) {
        res.status(400).json({
          status: 400,
          message: 'Specified account via URL doesn\'t exists',
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'Insufficient Funds',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'Specified account number doesn\'t exists',
      });
    }
  }

  /**
   * @description credits a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static async creditAccount(req, res) {
    const { accountNumber } = req.params;
    const { amount, accountnumber } = req.body;
    const { email } = req.user;
    try {
      const staff = await staffs.findByEmail('*', [email]);
      const s = `${staff.firstname} ${staff.lastname}`;
      const account = await accounts.findByAccountNumber('*', [accountnumber]);
      const bal = parseFloat(account.balance).toFixed(0);
      const credit = {
        balance: Number(bal) + Number(amount),
        date: new Date().toUTCString(),
      };
      const updated = await accounts.updateById(`balance = '${credit.balance}', lastdeposit = '${credit.date}'`, [account.id]);
      await transactions.createTransactionTable();
      const transaction = await transactions.insert(
        'accountnumber, type, cashier, amount, oldbalance, newbalance',
        [account.accountnumber, 'credit', s, amount, account.balance, updated.balance],
      );
      res.status(200).json({
        status: 200,
        message: 'Account credited successfully',
        data: transaction,
      });
      if (Number(accountNumber) !== account.accountnumber) {
        res.status(400).json({
          status: 400,
          message: 'Specified account via URL doesn\'t exists',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `${err.message}`,
      });
    }
  }

  /**
   * @description returns a user account
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */
  static async getAllAccount(req, res) {
    const { email } = req.user;
    const { emailAddress } = req.params;
    try {
      const user = await users.findByEmail('*', [email && emailAddress]);
      const userAccounts = await accounts.findByOwnerID('*', [user.id]);
      res.status(200).json({
        status: 200,
        message: 'Success',
        data: userAccounts,
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        serverMessage: `Error: ${err.message}`,
        message: 'Ensure the email on request.params matches that of user in token',
      });
    }
  }

  static async getSingleAccountTransactions(req, res) {
    const { accountNumber } = req.params;
    try {
      const account = await accounts.findByAccountNumber('*', [accountNumber]);
      if (account !== undefined) {
        try {
          const transaction = await transactions.findByAccountNumber('*', [account.accountnumber]);
          res.status(200).json({
            status: 200,
            message: 'success',
            data: [transaction],
          });
        } catch (err) {
          res.status(400).json({
            status: 400,
            message: `Error: ${err.message}`,
          });
        }
      } else {
        res.status(400).json({
          status: 400,
          message: 'Account number not found',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }

  static async getTransactionById(req, res) {
    const { transactionId } = req.params;
    try {
      const transaction = await transactions.findById('*', [transactionId]);
      if (transaction !== undefined) {
        res.status(200).json({
          status: 200,
          message: 'success',
          data: [transaction],
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'no transaction found for this ID',
        });
      }
    } catch (err) {
      res.status(404).json({
        status: err.statusCode,
        message: `Error: ${err.message}`,
      });
    }
  }

  static async getSpecificAccount(req, res) {
    const { accountNumber } = req.params;
    try {
      const account = await accounts.findByAccountNumber('*', [accountNumber]);
      if (account !== undefined) {
        res.status(200).json({
          status: 200,
          message: 'Successful',
          data: [account],
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'Account number doesn\'t exist',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        error: `Error: ${err.message}`,
      });
    }
  }

  static async getAccounts(req, res) {
    const { status } = req.query;
    if (status === undefined) {
      try {
        const account = await accounts.findMany();
        if (account !== undefined) {
          res.status(200).json({
            status: 200,
            message: 'success',
            data: [account],
          });
        } else {
          res.status(400).json({
            status: 400,
            message: 'no registered accounts',
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: `Error: ${err.message}`,
        });
      }
    } else {
      try {
        const account = await accounts.findByStatus('*', [status]);
        if (account !== undefined) {
          res.status(200).json({
            status: 200,
            message: `Fetched all ${status} accounts`,
            data: [account],
          });
        } else {
          res.status(400).json({
            status: 400,
            message: `No ${status} accounts found`,
          });
        }
      } catch (err) {
        res.status(400).json({
          status: 400,
          error: `Error:  ${err.message}`,
        });
      }
    }
  }

  // static resetPassword(req, res) {
  //   const { newPassword, oldPassword } = req.body;
  //   const { email } = req.user;
  //   try {
  //     const user = users.filter(u => u.email === email);
  //     if (user.length <= 0) {
  //       const staff = staffs.filter(s => s.email === email);
  //       if (Util.validatePassword(oldPassword, staff[0].password)) {
  //         staff[0].password = Util.hashPassword(newPassword);
  //         res.status(200).json({
  //           status: 200,
  //           message: 'password changed successfully',
  //         });
  //       } else {
  //         res.status(404).json({
  //           status: 404,
  //           message: 'passwords do not match',
  //         });
  //       }
  //     } else if (user.length > 0) {
  //       if (Util.validatePassword(oldPassword, user[0].password)) {
  //         user[0].password = Util.hashPassword(newPassword);
  //         res.status(200).json({
  //           status: 200,
  //           message: 'password changed successfully',
  //         });
  //       } else {
  //         res.status(404).json({
  //           status: 404,
  //           message: 'passwords do not match',
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 400,
  //       message: 'Error: credentials not in database',
  //     });
  //   }
  // }
}
export default Accounts;
