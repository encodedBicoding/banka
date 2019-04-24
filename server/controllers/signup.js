import Auth from '../helpers/auth';
import Acc from '../helpers/setup';

class Signup {
  /**
    * @description adds a new user to the database
    * @param req express request object
    * @param res express response object
    * @returns {object} JSON
    */

  static async addToDatabase(req, res) {
    const {
      firstname,
      email,
      password,
      lastname,
    } = req.body;
    const token = Auth.generateToken({ email, firstname });
    try {
      const user = await Acc.setup('client',
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
          ...user,
          password: '',
          token,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: `Error: ${err.message}`,
      });
    }
  }
  /**
    * @description adds new admin to the database
    * @param req express request object
    * @param res express response object
    * @returns {object} JSON
    */

  static async addAdmin(req, res) {
    const {
      firstname,
      lastname,
      email,
      type,
      password,
    } = req.body;
    if (type === 'staff') {
      const token = Auth.generateToken({
        email, firstname, lastname, isAdmin: true, type: 'staff',
      });
      try {
        const newStaff = await Acc.setup('staff',
          email,
          password,
          firstname,
          lastname);
        req.body.tokenAuth = token;
        req.user = Auth.verifyToken(token);
        res.status(201).json({
          status: 201,
          message: 'Staff created successfully',
          data: {
            ...newStaff,
            password: '',
            token,
          },
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: `Error: ${err.message}`,
        });
      }
    } else if (type === 'admin') {
      const token = Auth.generateToken({
        email,
        firstname,
        lastname,
        isAdmin: true,
        type: 'admin',
      });
      try {
        const newAdmin = await Acc.setup('admin',
          email,
          password,
          firstname,
          lastname);
        req.body.tokenAuth = token;
        req.user = Auth.verifyToken(token);
        res.status(201).json({
          status: 201,
          message: 'Admin created successfully',
          data: {
            ...newAdmin,
            password: '',
            token,
          },
        });
      } catch (err) {
        res.status(400).json({
          status: 400,
          message: `Error: ${err.message}`,
        });
      }
    }
  }
}

export default Signup;
