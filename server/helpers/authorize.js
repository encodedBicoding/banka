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
    if (!req.body.tokenAuth) {
      res.status(400).json({
        status: 400,
        message: 'No token supplied',
      });
    } else {
      const token = req.body.tokenAuth;
      if ((!Auth.verifyToken(token))) {
        res.status(401).json({
          status: 401,
          message: 'Incorrect token supplied',
        });
      } else {
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
      }
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
    if (!req.body.tokenAuth) {
      res.status(400).json({
        status: 400,
        message: 'No token supplied'
      });
    } else {
      const token = req.body.tokenAuth;
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
          req.user = payload;
          next();
        }
      }
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
    if (req.body.tokenAuth.length <= 0) {
      res.status(400).json({
        status: 400,
        message: 'Not token supplied',
      });
    } else {
      const token = req.body.tokenAuth;

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
          req.user = payload;
          next();
        }
      }
    }
  }
}
export default Authorize;
