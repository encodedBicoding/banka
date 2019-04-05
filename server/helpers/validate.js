import Database from '../models/Database';


const { users, staffs } = Database;

class Validate {
  static validateStaff(req, res, next)  {
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
}

export default Validate;
