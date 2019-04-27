import Auth from '../helpers/auth';
import { users, staffs } from '../postgresDB/DB/index';
import Util from '../helpers/util';


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
      const userObj = { ...user, password: '' };
      res.status(200).json({
        status: 200,
        message: 'Log in successful',
        data: {
          userObj,
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
    try {
      const user = await staffs.findByEmail('*', [email]);
      const token = Auth.generateToken({
        email,
        password,
        isAdmin: true,
        type: user.type,
      });
      req.user = Auth.verifyToken(token);
      req.body.token = token;
      res.status(200).json({
        status: 200,
        message: 'Login successful',
        data: {
          ...user,
          password: '',
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
