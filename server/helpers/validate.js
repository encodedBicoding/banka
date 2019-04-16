import Database from '../models/Database';


const { staffs } = Database;

/**
 * @class Validate
 */

class Validate {
  /**
   * @description verify staff authenticity before executing next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
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

  /**
   * @description verify admin authenticity before executing next middleware
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
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
}

export default Validate;
