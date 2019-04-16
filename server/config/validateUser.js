import Database from '../models/Database';
import Auth from '../helpers/auth';
import Util from '../helpers/util';

import Acc from '../helpers/setup';
/**
 * @class ValidateUser
 */

class ValidateUser {
  /**
   * @description validates user login details before calling next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const user = Database.users.filter(u => u.email === email);
    if (user.length <= 0 || (!Util.validatePassword(password, user[0].password))) {
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
    const { email, password } = req.body;
    const staff = Database.staffs.filter(s => s.email === email);
    if (staff.length <= 0 || (!Util.validatePassword(password, staff[0].password))) {
      res.status(404).json({
        status: 404,
        message: 'email or password not found',
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
  static checkUserExists(req, res, next) {
    const { email } = req.body;
    const found = Database.users.find(user => user.email === email);
    if (typeof found !== 'object') {
      next();
    } else {
      res.status(401).json({
        status: 401,
        message: 'A user with the given email already exists',
      });
    }
  }
  /**
   * @description adds a new user to the database
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */

  static addToDatabase(req, res) {
    const {
      firstName,
      email,
      password,
      lastName,
    } = req.body;
    const token = Auth.generateToken({ email, firstName });
    const user = Acc.setup('client',
      email,
      password,
      firstName,
      lastName);
    req.body.tokenAuth = token;
    res.status(201).json({
      status: 201,
      message: 'Account created successfully',
      data: {
        user,
        token,
      },
    });
  }

  /**
   * @description adds new admin to the database
   * @param req express request object
   * @param res express response object
   * @returns {object} JSON
   */

  static addAdmin(req, res) {
    const {
      firstName,
      email,
      type,
      password,
    } = req.body;
    const staff = Database.staffs.filter(s => s.email === email);
    if (staff.length <= 0) {
      if (type === 'staff') {
        const token = Auth.generateToken({
          email, firstName, isAdmin: true, type: 'staff',
        });
        const newStaff = Acc.setup('staff',
          email,
          password,
          firstName);
        req.body.tokenAuth = token;
        res.status(201).json({
          status: 201,
          data: {
            newStaff,
            token,
          },
        });
      } else if (type === 'admin') {
        const token = Auth.generateToken({
          email,
          firstName,
          isAdmin: true,
          type: 'admin',
        });
        const newAdmin = Acc.setup('admin',
          email,
          password,
          firstName);
        req.body.tokenAuth = token;
        res.status(201).json({
          status: 201,
          data: {
            newAdmin,
            token,
          },
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        message: 'Email already exists',
      });
    }
  }

  /**
   * @description checks the user input field for error
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */

  static signupInputField(req, res, next) {
    const {
      firstName, email, lastName, password,
    } = req.body;
    const nameTest = /^[A-z]{3,20}$/;
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    if (!nameTest.test(firstName)
        || !nameTest.test(lastName)
        || !emailTest.test(email)
        || !passText.test(password)) {
      res.status(403).json({
        status: 403,
        message: 'Please check that all fields are filled',
      });
    } else {
      next();
    }
  }
}

export default ValidateUser;
