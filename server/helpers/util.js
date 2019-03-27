const bcrypt = require('bcrypt');

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}
function validatePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}
module.exports = { hashPassword, validatePassword };