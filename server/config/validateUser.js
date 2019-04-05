import Database from '../models/Database';
import Auth from '../helpers/auth';
import Util from '../helpers/util';
import Client from '../models/Client';
import Admin from '../models/Admin';
import Staff from '../models/Staff';

class ValidateUser {
  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const user = Database.users.filter(u => u.email === email);
    const hashedPassword = Util.validatePassword(password, user[0].password);
    if (user.length <= 0 || (!hashedPassword)) {
      res.status(404).json({
        status: 404,
        message: 'email or password not found',
      });
    } else {
      next();
    }
  }

  static validateAdminLogin(req, res, next) {
    const { email, password } = req.body;
    const staff = Database.staffs.filter(s => s.email === email);
    const hashedPassword = Util.validatePassword(password, staff[0].password);
    if (staff.length <= 0 || hashedPassword === undefined) {
      res.status(404).json({
        status: 404,
        message: 'email or password not found',
      });
    } else {
      next();
    }
  }

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
    user.id = id + 1;
    Database.users.push(user);
    console.log(req.headers);
    res.status(201).json({
      status: 201,
      message: 'Account created successfully',
      data: {
        token,
        user,
      },
    });
  }


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
        const newStaff = new Staff(firstname, email, type, password);
        newStaff.id = id + 1;
        Database.staffs.push(newStaff);
        res.status(201).json({
          status: 201,
          message: newStaff,
        });
      } else if (type === 'admin') {
        const id = Database.staffs.length + 1;
        const newAdmin = new Admin(firstname, email, type, password);
        newAdmin.id = id + 1;
        Database.staffs.push(newAdmin);
        res.status(201).json({
          status: 201,
          message: newAdmin,
        });
      }
    } else {
      res.status(401).json({
        status: 401,
        message: 'Email already exists',
      });
    }
  }


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
        message: 'Please check that all field are filled',
      });
    } else {
      next();
    }
  }
}

export default ValidateUser;
