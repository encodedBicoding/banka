import Database from '../models/Database';
import Auth from '../helpers/auth';
import Util from '../helpers/util';
import Client from '../models/Client';
import Admin from '../models/Admin';
import Staff from '../models/Staff';

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
      firstname,
      email,
      password,
      lastname,
    } = req.body;
    const id = Database.users.length + 1;
    const pass = Util.hashPassword(password);
    const token = Auth.generateToken({ email, firstname });
    const user = new Client(firstname, email, pass, lastname);
    user.id = id;
    Database.users.push(user);
    res.status(201).json({
      status: 201,
      message: 'Account created successfully',
      data: [
        user,
        token,
      ],
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
      firstname,
      email,
      type,
      password,
    } = req.body;
    const staff = Database.staffs.filter(s => s.email === email);
    if (staff.length <= 0) {
      if (type === 'staff') {
        const id = Database.staffs.length + 1;
        const pass = Util.hashPassword(password);
        const token = Auth.generateToken({ email, firstname, isAdmin: true, type: 'staff' });
        const newStaff = new Staff(firstname, email, type, pass);
        newStaff.id = id + 1;
        Database.staffs.push(newStaff);
        res.status(201).json({
          status: 201,
          data: [
            newStaff,
            token,
          ],
        });
      } else if (type === 'admin') {
        const id = Database.staffs.length + 1;
        const pass = Util.hashPassword(password);
        const token = Auth.generateToken({
          email,
          firstname,
          isAdmin: true,
          type: 'admin',
        });
        const newAdmin = new Admin(firstname, email, type, pass);
        newAdmin.id = id + 1;
        Database.staffs.push(newAdmin);
        res.status(201).json({
          status: 201,
          data: [
            newAdmin,
            token,
          ],
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
      firstname, email, lastname, password,
    } = req.body;
    const nameTest = /^[A-z]{3,20}$/;
    const emailTest = /([A-z0-9.-_]+)@([A-z]+)\.([A-z]){2,5}$/;
    const passText = /[a-zA-Z0-9\w!@#$%^&*()_+|]{8,20}$/;
    if (!nameTest.test(firstname)
        || !nameTest.test(lastname)
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
