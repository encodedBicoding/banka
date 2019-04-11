import bcrypt from 'bcrypt';

class Util {
  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static validatePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default Util;
