import Auth from '../helpers/auth';
import { users, staffs } from '../postgresDB/DB/index';


class Login {
  static index(req, res) {
    res.status(200).json({
      status: 200,
      message: 'Welcome to the login page',
    });
  }

  static async clientLogin(req, res) {
    const { email, password } = req.body;
    const token = Auth.generateToken({ email, password, isAdmin: false });
    try {
      const user = await users.findByEmail('*', [email]);
      req.body.token = token;
      req.user = Auth.verifyToken(token);
      res.status(200).json({
        status: 200,
        message: 'Log in successful',
        data: {
          user,
          token,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: err.statusCode,
        message: `Error: ${err.message}`,
      });
    }
  }

  static async adminLogin(req, res) {
    const { email, password } = req.body;
    const token = Auth.generateToken({
      email, password, isAdmin: true, type: 'admin',
    });
    try {
      const user = await staffs.findByEmail('*', [email]);
      req.body.token = token;
      req.user = Auth.verifyToken(token);
      res.status(200).json({
        status: 200,
        message: 'Log in successful',
        data: {
          user,
          token,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: err.statusCode,
        message: `Error: ${err.message}`,
      });
    }
  }

  static async staffLogin(req, res) {
    const { email, password } = req.body;
    const token = Auth.generateToken({
      email, password, isAdmin: true, type: 'staff',
    });
    try {
      const user = await staffs.findByEmail('*', [email]);
      req.body.token = token;
      req.user = Auth.verifyToken(token);
      res.status(200).json({
        status: 200,
        message: 'Log in successful',
        data: {
          user,
          token,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: err.statusCode,
        message: `Error: ${err.message}`,
      });
    }
  }
}

export default Login;
