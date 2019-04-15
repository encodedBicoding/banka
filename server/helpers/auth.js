import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();


const secretKey = process.env.SECRET_KEY;

class Auth {
  static generateToken(payload) {
    return jwt.sign(payload, secretKey, { expiresIn: '1week' });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, secretKey);
    } catch (e) {
      return { error: `${e}` };
    }
  }
}

export default Auth;
