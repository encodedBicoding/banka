import Database from '../models/Database';
import Util from './util';


const { staffs, users } = Database;

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
  
  /**
   * @description checks if user exists returns error if true or next if false
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static checkUserExistence(req, res, next) {
    const {email} = req.body;
    const found = users.find(user => user.email === email);
    if (typeof found !== 'object') {
      next();
    } else {
      res.status(401).json({
        status: 401,
        message: 'A user with the given email already exists',
      });
    }
  }
  
  static validateLoginForm(req, res, next) {
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    const {email, password} = req.body;
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
  static validateLogin(req, res, next) {
    const {email, password} = req.body;
    const user = users.filter(u => u.email === email);
    if (user.length <= 0 ||
        (!Util.validatePassword(password, user[0].password))) {
      res.status(404).json({
        status: 404,
        message: 'email or password not found',
      });
    } else {
      next();
    }
  }
  
  /**
   * @description validates admin login details before calling next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static validateAdminLogin(req, res, next) {
    const {email, password} = req.body;
    const staff = staffs.filter(s => s.email === email);
    if (staff.length <= 0 ||
        (!Util.validatePassword(password, staff[0].password))) {
      res.status(404).json({
        status: 404,
        message: 'email or password not found',
      });
    } else {
      next();
    }
  }
  
  static validateAccountForm(req, res, next) {
    const {userType, accType} = req.body;
    const errArr = [];
    let errMsg;
    const valueTest = /^([A-z]+)$/;
    if (!valueTest.test(userType) || userType === undefined) {
      errArr.push('User Type');
    } if (!valueTest.test(accType) || accType === undefined) {
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
    const {amount, accId} = req.body;
    const amountTest = /^([0-9.]+)$/;
    const accTest = /^([0-9]+)$/;
    const errArr = [];
    let errMsg;
    if (!amountTest.test(amount) || amount === undefined) {
      errArr.push('Amount');
    } if (!accTest.test(accId) || accId === undefined) {
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
    const { oldPassword, newPassword} = req.body;
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
}

export default Validate;
