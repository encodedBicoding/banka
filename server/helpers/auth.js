const jwt = require('jsonwebtoken'),
      secretKey = 'catsanddogs';

const generateToken = payload => {
    let token = jwt.sign(payload, secretKey, {expiresIn: '1week'});
    return token;
};
const verifyToken = token =>{
    try{
        let payload =jwt.verify(token, secretKey);
        return payload;
    } catch(e){
        return { error: `${e}`}
    }
};

module.exports = { generateToken, verifyToken };
