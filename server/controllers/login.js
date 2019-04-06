import Auth from '../helpers/auth';
import Database from '../models/Database';

const { users, staffs } = Database;

class Login {
  static index(req, res) {
    res.status(200).json({
      status: 200,
      message: 'Welcome to the login page',
    });
  }

  static login(req, res) {
    const { email, password } = req.body;
    const token = Auth.generateToken({ email, password });
    const user = users.filter(u => u.email === email);
    res.status(200).json({
      status: 200,
      data: [
        user[0],
        token,
      ],
    });
  }

  static adminLogin(req, res) {
    const { email, password } = req.body;
    const token = Auth.generateToken({ email, password, isAdmin: true });
    const staff = staffs.filter(s => s.email === email);
    res.status(200).json({
      status: 200,
      data: [
        {
          staff: staff[0],
        },
        token,
      ],

    });
  }
}

export default Login;
