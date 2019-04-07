import Database from '../models/Database';
import Auth from './auth';


const { users, staffs } = Database;

class Validate {
  static validateStaff(req, res, next) {
    const { staffId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId) && s.isAdmin === true);
    if (staff.length <= 0) {
      res.status(401).json({
        status: 401,
        message: 'Not Authorized',
      });
    } else {
      next();
    }
  }

  static validateAdmin(req, res, next) {
    const { staffId } = req.params;
    const staff = staffs.filter(s => s.id === Number(staffId) && s.type === 'admin');
    if (staff.length <= 0) {
      res.status(401).json({
        status: 401,
        message: 'Not Authorized',
      });
    } else {
      next();
    }
  }

  static validateUser(req, res, next) {
    const { userId } = req.params;
    const user = users.filter(client => client.id === Number(userId) && client.type === 'client');
    if (user.length <= 0) {
      res.status(401).json({
        status: 401,
        message: 'Not Authorized',
      });
    } else {
      next();
    }
  }

  static authenticateUser(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if ((!Auth.verifyToken(token))) {
      res.status(401).json({
        status: 401,
        message: 'Not authorized',
      });
    } else {
      const payload = Auth.verifyToken(token);
      if (!payload.email) {
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      } else {
        next();
      }
    }
  }

  static authenticateStaff(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if ((!Auth.verifyToken(token))) {
      res.status(401).json({
        status: 401,
        message: 'Not authorized',
      });
    } else {
      const payload = Auth.verifyToken(token);
      const { isAdmin } = payload;
      if (isAdmin !== true) {
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      } else {
        next();
      }
    }
  }

  static authenticateAdmin(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if ((!Auth.verifyToken(token))) {
      res.status(401).json({
        status: 401,
        message: 'Not authorized',
      });
    } else {
      const payload = Auth.verifyToken(token);
      const { isAdmin, type } = payload;
      if (isAdmin !== true && type !== 'admin') {
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      } else {
        next();
      }
    }
  }
}

export default Validate;
