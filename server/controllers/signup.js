import Database from '../models/Database';
import Auth from '../helpers/auth';
import Acc from '../helpers/setup';

class Signup {
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
    const token = Auth.generateToken({ email, firstname });
    const user = Acc.setup('client',
      email,
      password,
      firstname,
      lastname);
    req.body.tokenAuth = token;
    req.user = Auth.verifyToken(token);
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
      firstname,
      lastname,
      email,
      type,
      password,
    } = req.body;
    const staff = Database.staffs.filter(s => s.email === email);
    if (staff.length <= 0) {
      if (type === 'staff') {
        const token = Auth.generateToken({
          email, firstname, lastname, isAdmin: true, type: 'staff',
        });
        const newStaff = Acc.setup('staff',
          email,
          password,
          firstname,
          lastname);
        req.body.tokenAuth = token;
        req.user = Auth.verifyToken(token);
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
          firstname,
          lastname,
          isAdmin: true,
          type: 'admin',
        });
        const newAdmin = Acc.setup('admin',
          email,
          password,
          firstname,
          lastname);
        req.body.tokenAuth = token;
        req.user = Auth.verifyToken(token);
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
}

export default Signup;
