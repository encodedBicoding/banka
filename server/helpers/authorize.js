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
    if (token !== undefined) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      const payload = Auth.verifyToken(token);
      if (payload !== undefined && payload !== false) {
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
        res.status(401).json({
          status: 401,
          message: 'Not Authorized',
        });
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
    if (token !== undefined) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      const payload = Auth.verifyToken(token);
      if (payload !== undefined && payload !== false) {
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
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
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
    if (token !== undefined) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      const payload = Auth.verifyToken(token);
      if (payload !== undefined && payload !== false) {
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
        res.status(401).json({
          status: 401,
          message: 'Not authorized',
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: 'Not token supplied',
      });
    }
  }

  static authenticateBothAdminAndStaff(req, res, next) {
    let token = req.body.tokenAuth
      || req.headers.authorization
      || req.headers['x-access-token'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    const payload = Auth.verifyToken(token);
    if (payload !== undefined && payload !== false) {
      const { isAdmin } = payload;
      if (isAdmin !== true) {
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
