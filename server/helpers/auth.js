import jwt from 'jsonwebtoken';


const secretKey = 'catsanddogs';

class Auth {
  static generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1week' });
    return token;
  }

  static verifyToken(token) {
    try {
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (e) {
      return { error: `${e}` };
    }
  }
}

export default Auth;
