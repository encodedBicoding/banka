import Auth from './auth';


class Authorize {
  /**
   * @description uses JWT to validate user authenticity
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static authenticateUser(req, res, next) {
    let token = req.body.tokenAuth
      || req.headers.authorization
      || req.headers['x-access-token'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      const payload = Auth.verifyToken(token);
      if (!payload.email && payload.isAdmin !== false) {
        res.status(401).json({
          status: 401,
          message: 'Not Authorized',
        });
      } else {
        req.user = payload;
        next();
      }
    } else {
      res.status(400).json({
        status: 400,
        message: 'No token supplied',
      });
    }
  }

  /**
   * @description uses JWT to validate staff authenticity
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static authenticateStaff(req, res, next) {
    let token = req.body.tokenAuth
      || req.headers.authorization
      || req.headers['x-access-token'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      const payload = Auth.verifyToken(token);
      const { type, isAdmin } = payload;
      if (type !== 'staff' && isAdmin !== true) {
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      } else {
        req.user = payload;
        next();
      }
    } else {
      res.status(400).json({
        status: 400,
        message: 'No token supplied',
      });
    }
  }

  /**
   * @description uses JWT to validate admin authenticity
   * @param req express request object
   * @param res express response object
   * @param next express next to execute next middleware
   * @returns {object} JSON
   */
  static authenticateAdmin(req, res, next) {
    let token = req.body.tokenAuth
      || req.headers.authorization
      || req.headers['x-access-token'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    if (token) {
      const payload = Auth.verifyToken(token);
      const { isAdmin, type } = payload;
      if (isAdmin !== true && type !== 'admin') {
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      } else {
        req.user = payload;
        next();
      }
    } else {
      res.status(400).json({
        status: 400,
        message: 'Not token supplied',
      });
    }
  }
}
export default Authorize;
