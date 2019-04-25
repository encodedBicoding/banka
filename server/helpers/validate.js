import Util from './util';
import { users, staffs } from '../postgresDB/DB/index';


/**
 * @class Validate
 */

class Validate {
  /**
   * @description checks the user input field for error
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static validateSignupField(req, res, next) {
    const {
      firstname, lastname, email, password,
    } = req.body;
    const nameTest = /^[A-z]{3,20}$/;
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    const errArr = [];
    let errMsg;
    if (!nameTest.test(firstname) || firstname === undefined) {
      errArr.push('First name');
    } if (!nameTest.test(lastname) || lastname === undefined) {
      errArr.push('Last name');
    } if (!emailTest.test(email) || email === undefined) {
      errArr.push('Email');
    } if (!passText.test(password) || password === undefined) {
      errArr.push('Password');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }


  static async checkAdminExistence(req, res, next) {
    const { email } = req.body;
    try {
      const found = await staffs.findByEmail('*', [email]);
      if (typeof found !== 'object') {
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: 'A staff with the given email already exists',
        });
      }
    } catch (err) {
      res.status(err.statusCode).json({
        status: err.statusCode,
        message: `Error: ${err.message}`,
      });
    }
  }

  static async checkUserExistence(req, res, next) {
    const { email } = req.body;
    try {
      const found = await users.findByEmail('*', [email]);
      if (typeof found !== 'object') {
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: 'A user with the given email already exists',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }

  static validateLoginForm(req, res, next) {
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    const { email, password } = req.body;
    const errArr = [];
    let errMsg;
    if (!emailTest.test(email) || email === undefined) {
      errArr.push('Email');
    } if (!passText.test(password) || password === undefined) {
      errArr.push('Password');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }

  /**
   * @description validates user login details before calling next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static async validateLogin(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await users.findByEmail('email, password', [email]);
      const match = Util.validatePassword(password, user.password);
      if (match) {
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: 'email or password incorrect',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'User does not exists',
      });
    }
  }

  /**
   * @description validates admin login details before calling next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static async validateAdminLogin(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await staffs.findByEmail('email, password', [email]);
      const match = Util.validatePassword(password, user.password);
      if (match) {
        next();
      } else {
        res.status(400).json({
          status: 400,
          message: 'email or password incorrect',
        });
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: 'User does not exists',
      });
    }
  }

  static validateAccountForm(req, res, next) {
    const { userType, accType } = req.body;
    const errArr = [];
    const userTypeTest = ['personal', 'org', 'sme'];
    const accTypeTest = ['current', 'savings'];
    let errMsg;
    const valueTest = /^([A-z]+)$/;
    if (!valueTest.test(userType)
        || userType === undefined
        || !userTypeTest.includes(userType)) {
      errArr.push('User Type');
    } if (!valueTest.test(accType)
        || accType === undefined
        || !accTypeTest.includes(accType)) {
      errArr.push('Account Type');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }

  /**
   * @description checks the user input field for error
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */

  static validateAdminSignupField(req, res, next) {
    const {
      firstname, lastname, email, password, type,
    } = req.body;
    const nameTest = /^[A-z]{3,20}$/;
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    const errArr = [];
    let errMsg;
    if (!nameTest.test(firstname) || firstname === undefined) {
      errArr.push('First name');
    } if (!nameTest.test(lastname) || lastname === undefined) {
      errArr.push('Last name');
    } if (!emailTest.test(email) || email === undefined) {
      errArr.push('Email');
    } if (!passText.test(password) || password === undefined) {
      errArr.push('Password');
    } if (!nameTest.test(type) || type === undefined) {
      errArr.push('Type');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }

  static validateAccountTransForm(req, res, next) {
    const { amount, accountnumber } = req.body;
    const amountTest = /^([0-9.]+)$/;
    const accTest = /^([0-9]+)$/;
    const errArr = [];
    let errMsg;
    if (!amountTest.test(amount) || amount === undefined) {
      errArr.push('Amount');
    } if (!accTest.test(accountnumber) || accountnumber === undefined) {
      errArr.push('Account');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }

  static validatePasswordResetForm(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    const errArr = [];
    let errMsg;
    const valueTest = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    if (!valueTest.test(oldPassword) || oldPassword === undefined) {
      errArr.push('Old Password');
    } if (!valueTest.test(newPassword) || newPassword === undefined) {
      errArr.push('New Password');
    }
    if (errArr.length > 1) {
      errMsg = errArr.join(' and ');
      res.status(403).json({
        status: 403,
        message: `${errMsg} fields are empty, missing or values not valid`,
      });
    } else if (errArr.length === 1) {
      errMsg = errArr.join('');
      res.status(403).json({
        status: 403,
        message: `${errMsg} field is empty, missing or values not valid`,
      });
    } else {
      next();
    }
  }

  static validateAccountNumber(req, res, next) {
    const { accountNumber } = req.params;
    const regEx = /^([0-9]+)$/;
    if (!regEx.test(accountNumber)) {
      res.status(400).json({
        status: 400,
        error: 'Invalid account number',
      });
    } else {
      next();
    }
  }

  static validateTransactionID(req, res, next) {
    const { transactionId } = req.params;
    const regEx = /^([0-9]+)$/;
    if (!regEx.test(transactionId)) {
      res.status(400).json({
        status: 400,
        error: 'Invalid Transaction ID',
      });
    } else {
      next();
    }
  }

  static validateEmailAddress(req, res, next) {
    const { emailAddress } = req.params;
    const regEx = /^([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    if (!regEx.test(emailAddress)) {
      res.status(400).json({
        status: 400,
        error: 'Invalid Email Address',
      });
    } else {
      next();
    }
  }

  static validateStatus(req, res, next) {
    const { status } = req.query;
    const validStatus = ['active', 'dormant'];
    if (status) {
      const isDormantOrActive = validStatus.includes(status);
      if (!isDormantOrActive) {
        res.status(400).json({
          status: 400,
          error: 'status value must be active or dormant',
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
}

export default Validate;
